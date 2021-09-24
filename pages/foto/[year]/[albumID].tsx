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
  console.log('album: ', album);

  useEffect(() => {
    fetch(getApiURL("getYearAlbumsInfo?year=") + year).then((resp) => {

      if (resp.status == 201) {
        resp.json().then((json) => {
          console.log('json: ', json);
          setAlbum(json.albums.find((album) => { return album.title === albumID }));
        });
      } else {
        resp.text().then((value) => {
          console.log("tvalue: ", value);
        });
      }
    });
  }, [year]);

  let date: any = new Date(album.date);
  let day = date.getDate()+1;
  day = (day < 10)? "0"+day: day;
  let month = date.getMonth()+1;
  month = (month < 10)? "0"+month: month;
  date = day+"."+month+"." + date.getFullYear();

  return (
    <>
      <div className="container-fluid">
        <div className={" row my-4 justify-content-center align-items-center"}>
          <div className="col-11 col-md-10">
            <div className="text-blue fw-bold text-center h1 my-3">{date + " - " + album.name}</div>
            {// eslint-disable-next-line @next/next/no-img-element
              //<img alt="" src="http://localhost:3000/api/getPhoto?file=pokus/10.jpg&minify" onContextMenu={showContextMenu} onClick={downloadImage.bind(this, "http://localhost:3000/api/getPhoto?file=pokus/10.jpg&minify")} />
            }
          </div>
        </div>
      </div>
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

export default AlbumDetail;
