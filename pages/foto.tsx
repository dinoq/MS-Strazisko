// eslint-disable-next-line
//import classes from "./foto.module.css";

import { GetServerSideProps } from "next";
import { withIronSession } from "next-iron-session";
import { useState } from "react";
import { useRef } from "react";
import classes from "/styles/login.module.scss"
import Image from "next/image";

const foto = (props) => {
    console.log("props.logged", props.logged);
    return (
        <>

            <div className="container-fluid">
                <div className={" row my-4 justify-content-center align-items-center"}>
                    <div className="col-10 d-flex justify-content-center">
                        {props.logged && <Gallery photos={props.photos}/>}
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


const Gallery = ({photos}) => {
    let albums: Array<{ date: string, title: string, photos: Array<any> }> = [];

    let alb = { date: "2020-05-05", title: "Výlet v přírodě 20. 5.", photos: [1, 2, 3, 4, 5, 6, 7, 8] };
    albums.push(alb);
    albums.push(alb);
    alb = { date: "2018-05-05", title: "Výlet v přírodě 20. 5.", photos: [1, 2, 3, 4, 5, 6, 7, 8] };
    albums.push(alb);

    let year = new Date(albums[0].date).getFullYear();
    console.log('year: ', year);
    let albumsComponents = albums.map((album, index, array) => {
        const albumYear = new Date(album.date).getFullYear();
        const anotherYearComponent = (year !== albumYear || index === 0) ? <div className="text-blue text-center h2">{albumYear}</div> : "";
        return (
            <>
                {anotherYearComponent}
                <div key={"album-" + index} className={classes.gallery}>
                    <div className="text-blue text-center h4">{album.title} {albumYear}</div>
                    <div className="album-images-preview d-flex">
                        {album.photos.map((photo, index, array) => {
                            if (index < 4) {
                                return (
                                    <div key={"photo-" + index + "-" + album.title + "-" + album.date}>
                                        <div className="position-relative" style={{width: "100px", height: "100px"}}>
                                            <Image alt="TODO" src={photos[0]} layout="fill" />
                                        </div>

                                    </div>
                                );
                            }
                        })}
                    </div>

                </div>
            </>
        )
    })

    return (
        <>
            <div className={classes.gallery}>
                {albumsComponents}
            </div>
        </>
    )
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const loggedIn = req.session.get("loggedIn");
        console.log('loggedIn: ', loggedIn);

        if (!loggedIn) {

            return {
                props: { logged: false }
            };
        }
        const dev = process.env.NODE_ENV !== 'production';

        const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';
        //get photos URLs
        let resp: any = await fetch(server + '/api/photos', {
            method: "POST",
            mode: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({  })
        });
        resp = await resp.json();
        console.log('resp photos: ', resp);

        return {
            props: { logged: true, photos: resp.photos }
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