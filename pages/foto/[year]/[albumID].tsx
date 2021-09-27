// eslint-disable-next-line
import classes from "./albumID.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withIronSession } from "next-iron-session";
import { getApiURL } from "../../../utils";

const AlbumDetail: React.FC<{ logged: boolean }> = (props) => {
  const router = useRouter();
  const { year, albumID } = router.query;

  async function downloadImage(imageSrc) {
    return;
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'img.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [viewedPhoto, setViewedPhoto] = useState({});
  const [contextMenuProp, setContextMenuProps] = useState({ top: 0, left: 0 });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuVisible(true);
    setContextMenuProps(prevState => {
      return { ...prevState, left: (e.pageX - 10), top: (e.pageY - 10) }
    })

  }

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setContextMenuVisible(false);
    })
    return () => {
    }
  }, [])

  const [album, setAlbum] = useState<any>({});

  useEffect(() => {
    if (!year)
      return;
    fetch("/api/getYearAlbumsInfo?year=" + year).then((resp) => {

      if (resp.status == 201) {
        console.log("JES");
        resp.json().then((json) => {
          console.log('json: ', json);
          let a = json.albums.find((album) => { return album.title === albumID });
          setAlbum(a);
        });
      } else {
        resp.text().then((value) => {
          console.log("tvalue: ", value);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumID]);

  useEffect(() => {

    if (album && album.photos) {
      album.photos.forEach(async (photoURL, index, array) => {
        console.log('photoURL: ', photoURL);
        let i = document.createElement("img");
        i.setAttribute("src", "/api/getPhoto?file=" + photoURL);
        //await fetch("/api/getPhoto?file=" + photoURL);
        console.log('photoURL2: ', photoURL);
      })
    }
  }, [album])

  let date: any = new Date(album.date);
  let day = date.getDate() + 1;
  day = (day < 10) ? "0" + day : day;
  let month = date.getMonth() + 1;
  month = (month < 10) ? "0" + month : month;
  date = day + "." + month + "." + date.getFullYear();

  const hidePhotoOverlay = () => {
    setPhotoViewerVisible(false);
  }

  const showPhotoViewer = (photoURL) => {
    setViewedPhoto({ album: album.name, photoURL });
    setPhotoViewerVisible(true);
  }
  return (
    <>
      <div className="container-fluid">
        <div className={" row my-4 justify-content-center align-items-center"}>
          <div className="col-11 col-md-10">
            {album && album.name && <div className="text-blue fw-bold text-center h1 my-3">{date + " - " + album.name}</div>}
            {// eslint-disable-next-line @next/next/no-img-element
              //<img alt="" src="http://localhost:3000/api/getPhoto?file=pokus/10.jpg&minify" onContextMenu={showContextMenu} onClick={downloadImage.bind(this, "http://localhost:3000/api/getPhoto?file=pokus/10.jpg&minify")} />
            }
            <div className="row">
              {
                album && album.photos && album.photos.map((photoURL, index, array) => {
                  return (
                    <div key={"photo-" + index} className="col-12 col-sm-6 col-md-3 col-lg-2">
                      <div className={classes.imgContainer}>
                        {
                          // eslint-disable-next-line @next/next/no-img-element
                          //<a href={"/api/getPhoto?file=" + photoURL} target="_blank" rel="noreferrer"><img alt={"Fotografie z alba \"" + album.name + "\""} src={"/api/getPhoto?file=" + photoURL + "&minify"} onContextMenu={showContextMenu} /></a>
                        }
                        {
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={"Fotografie z alba \"" + album.name + "\""} src={"/api/getPhoto?file=" + photoURL + "&minify"} onContextMenu={showContextMenu} onClick={showPhotoViewer.bind(this, photoURL)} />
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      {photoViewerVisible && <PhotoViewer hide={hidePhotoOverlay} viewedPhoto={viewedPhoto} />}
      {contextMenuVisible && <ContextMenu styles={contextMenuProp} />}
    </>
  );
};

const ContextMenu = (props) => {

  return (
    <div className={classes.contextMenu} style={{ ...props.styles }}>
      <span>Uložit jako</span>
    </div>
  )
}

const PhotoViewer = (props) => {
  return (
    <div className={classes.photoViewer}>
      <div className={classes.overlay} onClick={props.hide}>

      </div>
      <div className={classes.viewerWrapper}>

        <div className={classes.leftArrow}></div>
          <div className={classes.photoWrapper}>
          <div className={classes.closeBtnWrapper} onClick={props.hide}>
            <div className={classes.closeBtn}></div>
          </div>
            {// eslint-disable-next-line @next/next/no-img-element
              <img src={"/api/getPhoto?file=" + props.viewedPhoto.photoURL} alt={"Fotografie z alba \"" + props.viewedPhoto.album + "\""} />}
          </div>
      </div><div className={classes.rightArrow}>

      </div>

    </div>
  )
}

export default AlbumDetail;
