// eslint-disable-next-line
import classes from "./YearPage.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withIronSession } from "next-iron-session";
import { getEnvDomain } from "../../utils";

const YearPage: React.FC<{ logged: boolean }> = (props) => {
  const router = useRouter();
  const { year } = router.query;

  return (
    <>
      <div className="container-fluid">
        <div className={" row my-4 justify-content-center align-items-center"}>
          <div className="col-11 col-md-10">
            {props.logged && <Gallery year={year} />}
            {!props.logged && <Login year={year} />}
          </div>
        </div>
      </div>
    </>
  );
};

const Login: React.FC<{ year: any }> = (props) => {
  const pwdRef = useRef<HTMLInputElement>(null);
  const [wrongPwd, setWrongPwd] = useState(false);
  const [unknownErrorOccured, setUnknownErrorOccured] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setWrongPwd(false);
    setUnknownErrorOccured(false);
    const year = props.year;

    let pwd = pwdRef.current.value;
    let resp = await fetch("/api/loginForYear", {
      method: "POST",
      mode: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pwd, year }),
    });
    if (resp.status == 201) {
      window.location.reload();
    } else if (resp.status == 401) {
      // Špatné heslo
      setWrongPwd(true);
    } else {
      // Došlo k neznámé chybě
      setUnknownErrorOccured(true);
    }
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        {wrongPwd && (
          <div className="alert alert-danger text-center" role="alert">
            Špatné heslo!
          </div>
        )}
        {unknownErrorOccured && (
          <div className="alert alert-danger text-center" role="alert">
            Špatné heslo!
          </div>
        )}
        <form onSubmit={login} className={classes.login}>
          <div className={classes.message}>
            Pro přístup ke fotogalerii musíte zadat heslo:
          </div>
          <input ref={pwdRef} type="password" />
          <input type="submit" value="Odeslat" />
        </form>
      </div>
    </>
  );
};

const Gallery = (props) => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(getEnvDomain() + "/api/getYearAlbumsInfo?year=" + props.year).then((resp) => {

      if (resp.status == 201) {
        resp.json().then((json) => {
          console.log('json: ', json);
          setAlbums(json.albums);
        });
      } else {
        resp.text().then((value) => {
          console.log("tvalue: ", value);
        });
      }
    });
  }, []);

  const albumYear = new Date(albums[0]?.date).getFullYear();

  return (
    <>
      <div>{
        albums.map((album, index, array) => {
          return (
            <div key={"album-" + index}>
              <div className="text-blue text-center h4 my-3">
                <Link href={"/foto/" + props.year + "/" + album.title}>
                  <a>
                    {album.name}
                  </a>
                </Link>
              </div>
              <Link href={"/foto/" + props.year + "/" + album.title}>
                <a>
                  <div className={classes["overlay"] + " col-12"}>
                    <div>Více &gt;&gt;</div>
                  </div>
                </a>
              </Link>
              <div className="album-images-preview row">
                {album.photos.map((photo, index, array) => {
                  let additionalClasses = [
                    "col-6 col-md-3",
                    "col-6 col-md-3",
                    "d-none d-md-block col-md-3",
                    "d-none d-md-block col-md-3",
                  ];
                  return (
                    <div
                      key={"photo-" + index + "-" + album.name + "-" + album.date}
                      className={additionalClasses[index] + " p-0"}
                    >
                      <div className={classes["img-container"]}>
                        {
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={"Fotografie z alba \"" + album.name + "\""} src={"/api/getPhoto?file=" + photo + "&minify"} />
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })

      }</div>
    </>
  );
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const fotoIndex = req.url.indexOf("foto/") + 5;
    const pageYear = req.url.substring(fotoIndex, fotoIndex + 9);
    const loggedForYears: Array<any> = req.session.get("loggedForYears");
    console.log('loggedForYears8: ', loggedForYears);

    if (
      loggedForYears &&
      loggedForYears.length &&
      loggedForYears.includes(pageYear)
    ) {
      /*let resp: any = await fetch(
        getEnvDomain() + "/api/getAlbumPhotos?year=" + pageYear
      )
      if(resp.status == 201){
        resp = await resp.json();
        console.log('resp: ', resp);
      }*/

      return {
        props: { logged: true },
      };
    } else {
      return {
        props: { logged: false },
      };
    }
  },
  {
    cookieName: "myapp_cookiename",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
  }
);
export default YearPage;
