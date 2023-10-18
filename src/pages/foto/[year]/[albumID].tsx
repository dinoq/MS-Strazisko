// eslint-disable-next-line
import classes from "./albumID.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import PhotoViewer from "../../../components/PhotoViewer/PhotoViewer";

type AlbumDetailProps = {
    logged: boolean
}
const AlbumDetail: React.FC<AlbumDetailProps> = ({
    logged
}) => {
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
  const [viewedPhoto, setViewedPhoto] = useState({ album: "", photoURL: "" });
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

      if (resp.status == 200) {
        resp.json().then((json) => {
          let a = json.albums.find((album) => { return album.title === albumID });
          setAlbum(a);
        });
      } else {
        resp.text().then((value) => {
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumID]);

  useEffect(() => {
    if (album && album.photos) {
      album.photos.forEach(async (photoURL, index, array) => {
        let i = document.createElement("img");
        i.setAttribute("src", "/api/getPhoto?file=" + photoURL);
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

  const nextPhoto = () => {
    const actualPhotoIndex = album.photos.findIndex(photo => photo == viewedPhoto.photoURL);
    let nextPhotoIndex;
    if (actualPhotoIndex < album.photos.length - 1) {
      nextPhotoIndex = actualPhotoIndex + 1;
    } else {
      nextPhotoIndex = 0;
    }
    setViewedPhoto({ album: album.name, photoURL: album.photos[nextPhotoIndex] });
  }

  const prevPhoto = () => {
    const actualPhotoIndex = album.photos.findIndex(photo => photo == viewedPhoto.photoURL);
    let prevPhotoIndex;
    if (actualPhotoIndex > 0) {
      prevPhotoIndex = actualPhotoIndex - 1;
    } else {
      prevPhotoIndex = album.photos.length - 1;
    }
    setViewedPhoto({ album: album.name, photoURL: album.photos[prevPhotoIndex] });
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
      {photoViewerVisible && <PhotoViewer hide={hidePhotoOverlay} viewedPhoto={viewedPhoto} nextPhoto={nextPhoto} prevPhoto={prevPhoto} />}
      {contextMenuVisible && <ContextMenu styles={contextMenuProp} />}
    </>
  );
};


export default AlbumDetail;
