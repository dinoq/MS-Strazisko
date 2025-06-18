"use client"

// eslint-disable-next-line
import classes from "./album.module.scss";
import { useEffect, useState } from "react";
import ContextMenu from "@features/web/components/ContextMenu/ContextMenu";
import PhotoViewer from "@features/web/components/PhotoViewer/PhotoViewer";
import { AlbumInfo } from "@features/data/lib/types";

type AlbumDetailProps = {
    album: AlbumInfo
}
const AlbumDetail: React.FC<AlbumDetailProps> = ({
    album
}) => {

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


    useEffect(() => {
        if (album && album.photos) {
            album.photos.forEach(async (photoURL, index, array) => {
                let i = document.createElement("img");
                i.setAttribute("src", "/api/photo?file=" + photoURL);
            })
        }
    }, [album])


    let date: any; 
    if(album){
        date = new Date(album.date);
        let day = date.getDate() + 1;
        day = (day < 10) ? "0" + day : day;
        let month = date.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;
        date = day + "." + month + "." + date.getFullYear();
    }

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
                        <div className="row">
                            {
                                album && album.photos && album.photos.map((photoURL, index, array) => {
                                    return (
                                        <div key={"photo-" + index} className="col-12 col-sm-6 col-md-3 col-lg-2">
                                            <div className={classes.imgContainer}>
                                                {
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img alt={"Fotografie z alba \"" + album.name + "\""} src={"/api/photo?file=" + photoURL + "&minify"} onContextMenu={showContextMenu} onClick={showPhotoViewer.bind(this, photoURL)} />
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
