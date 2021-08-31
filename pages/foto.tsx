// eslint-disable-next-line
//import classes from "./foto.module.css";

import { GetServerSideProps } from "next";
import { withIronSession } from "next-iron-session";
import { useEffect, useState } from "react";
import { useRef } from "react";
import classes from "/styles/foto.module.scss"
import Image from "next/image";
import Link from "next/link";

const foto = (props) => {
    console.log("props.logged", props.logged);
    return (
        <>

            <div className="container-fluid">
                <div className={" row my-4 justify-content-center align-items-center"}>
                    <div className="col-10 d-flex justify-content-center">
                        {props.logged && <Gallery />}
                        {!props.logged && <Login />}
                    </div>
                </div>

            </div>
        </>
    )
}

const Login = (props) => {
    const pwdRef = useRef<HTMLInputElement>(null)
    const [wrongPwd, setWrongPwd] = useState(false);
    const [unknownErrorOccured, setUnknownErrorOccured] = useState(false);

    const login = async (event) => {
        event.preventDefault();
        setWrongPwd(false);
        setUnknownErrorOccured(false);

        let pwd = pwdRef.current.value;
        let resp = await fetch('/api/login', {
            method: "POST",
            mode: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pwd })
        });
        if (resp.status == 201) {
            window.location.reload();
        } else if (resp.status == 401) { // Špatné heslo
            setWrongPwd(true);
        } else { // Došlo k neznámé chybě
            setUnknownErrorOccured(true);
        }
    }

    return (
        <>
            <div className="d-flex flex-column">

                {wrongPwd &&
                    <div className="alert alert-danger text-center" role="alert">
                        Špatné heslo!
                    </div>
                }
                {unknownErrorOccured &&
                    <div className="alert alert-danger text-center" role="alert">
                        Špatné heslo!
                    </div>
                }
                <form onSubmit={login} className={classes.login}>
                    <div className={classes.message}>
                        Pro přístup ke fotogalerii musíte zadat heslo:
                    </div>
                    <input ref={pwdRef} type="password" />
                    <input type="submit" value="Odeslat" />
                </form>
            </div>
        </>
    )
}


const Gallery = (props) => {
    let albums: Array<{ date: string, title: string, photos: Array<any> }> = [];

    const [photos, setPhotos] = useState([]);


    useEffect(() => {        
        let resp: any = fetch('http://localhost:3000/api/photos').then((value) => {
            console.log("QWER");
            value.json().then((value) => {
                console.log('value: ', value);
                setPhotos(["q.jpg"]);
                
            })
        })
    }, [])
    let alb = { date: "2020-05-05", title: "Výlet v přírodě 20. 5.", photos: ["q.jpg", "a.jpg", "b.jpg", "q.jpg", "a.jpg", "b.jpg"] };
    albums.push(alb);
    albums.push(alb);
    alb = { date: "2018-05-05", title: "Výlet v přírodě 20. 5.", photos: ["q.jpg", "a.jpg", "b.jpg", "q.jpg", "a.jpg", "b.jpg"] };
    albums.push(alb);

    let year = new Date(albums[0].date).getFullYear();
    console.log('year: ', year);
    let albumsComponents = albums.map((album, index, array) => {
        const albumYear = new Date(album.date).getFullYear();
        const anotherYearComponent = (year !== albumYear || index === 0) ? <div key={"a"+index} className="text-blue fw-bold text-center h2 my-3">{albumYear}</div> : "";
        return (
            <div  key={"album-" + index}>
                {anotherYearComponent&& anotherYearComponent}
                    <div className="text-blue text-center h4 my-3">{album.title} {albumYear}</div>
                        <Link href={"/foto/" + album.date}><a><div className={classes["overlay"]}>
                            <div>
                            Více &gt;&gt;
                            </div>
                        </div></a></Link>
                    <div className="album-images-preview d-flex">
                        {album.photos.map((photo, index, array) => {
                            if (index < 4) {
                                return (
                                    <div key={"photo-" + index + "-" + album.title + "-" + album.date}>
                                        <div className={classes["img-container"]}>
                                            {// eslint-disable-next-line @next/next/no-img-element
                                            photo && <img alt="TODO" src={"/api/photo?file=" + photo} />}
                                        </div>

                                    </div>
                                );
                            }
                        })}
                    </div>

            </div>
        )
    })

    return (
        <>
            <div>
                {albumsComponents}
            </div>
        </>
    )
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const loggedIn = req.session.get("loggedIn");

        if (!loggedIn) {
            return {
                props: { logged: false }
            };
        }

        return {
            props: { logged: true }
        };
    },
    {
        cookieName: "myapp_cookiename",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
    }
);
export default foto;