import { FC, MouseEventHandler } from "react";
import classes from "./PhotoViewer.module.scss"

type PhotoViewerProps = {
    prevPhoto: () => void,
    nextPhoto: () => void,
    hide: MouseEventHandler<HTMLDivElement>,
    viewedPhoto: any // TODO typ?!?
}

const PhotoViewer: FC<PhotoViewerProps> = ({
    prevPhoto,
    nextPhoto,
    hide,
    viewedPhoto
}) => {
    document.body.addEventListener('keydown', e => {
        var key = e.key || e.key || 0;
        if (e.key === "ArrowRight" || e.code === "ArrowRight") {
            nextPhoto();
        } else if (e.key === "ArrowLeft" || e.code === "ArrowLeft") {
            prevPhoto();
        }
    });

    return (
        <div className={classes.photoViewer}>
            <div className={classes.overlay} onClick={hide}>

            </div>
            <div className={classes.viewerWrapper}>

                <div className={classes.photoWrapper}>

                    <div className={classes.arrowWrapper + " " + classes.leftArrow} onClick={prevPhoto}>
                        <div className={classes.arrow}>&lt;</div>
                    </div>
                    <div className={classes.arrowWrapper + " " + classes.rightArrow} onClick={nextPhoto}>
                        <div className={classes.arrow}>&gt;</div>
                    </div>

                    <div className={classes.closeBtnWrapper} onClick={hide}>
                        <div className={classes.closeBtn}></div>
                    </div>
                    {// eslint-disable-next-line @next/next/no-img-element
                        <img src={"/api/getPhoto?file=" + viewedPhoto.photoURL} alt={"Fotografie z alba \"" + viewedPhoto.album + "\""} />}


                </div>
            </div>

        </div>
    )
}

export default PhotoViewer;