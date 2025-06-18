import Link from "next/link";
import { FC } from "react";
import classes from "./AlbumsList.module.scss"
import { AlbumInfo } from "@features/data/lib/types";
import albums from "../page/albums";

type GalleryProps = {
    year: string,
    yearAlbumsInfo: Array<AlbumInfo>
}

const AlbumsList: FC<GalleryProps> = ({
    year,
    yearAlbumsInfo
}) => {
    const albumYear = yearAlbumsInfo?.length? new Date(yearAlbumsInfo[0]?.date).getFullYear() : 0;

    return <>
        <div>
            {!isNaN(albumYear) && <div className="text-blue fw-bold text-center h1 my-3">{"Školní rok " + albumYear + "/" + (albumYear + 1)}</div>}
            {
                yearAlbumsInfo && yearAlbumsInfo.length !== 0 && yearAlbumsInfo.map((album, index, array) => {
                    let date: any = new Date(album.date);
                    let day = date.getDate() + 1;
                    day = (day < 10) ? "0" + day : day;
                    let month = date.getMonth() + 1;
                    month = (month < 10) ? "0" + month : month;
                    date = day + "." + month + ".";
                    return (
                        <div key={"album-" + index}>
                            <div className="text-blue text-center h4 my-3">
                                <Link href={"/foto/" + year.replace("/", "_") + "/" + album.title}>

                                    {date + " - " + album.name}

                                </Link>
                            </div>
                            <Link href={"/foto/" + year.replace("/", "_") + "/" + album.title}>

                                <div className={classes["overlay"] + " col-12"}>
                                    <div>Více &gt;&gt;</div>
                                </div>

                            </Link>
                            <div className="album-images-preview row">
                                {album.photos.map((photo, index, array) => {
                                    let additionalClasses = [
                                        "col-6 col-md-3 col-lg-2",
                                        "col-6 col-md-3 col-lg-2",
                                        "d-none d-md-block col-md-3 col-lg-2",
                                        "d-none d-md-block col-md-3 col-lg-2",
                                        "d-none d-lg-block col-lg-2",
                                        "d-none d-lg-block col-lg-2",
                                    ];
                                    return (
                                        <div
                                            key={"photo-" + index + "-" + album.name + "-" + album.date}
                                            className={additionalClasses[index] + " p-0"}
                                        >
                                            <div className={classes["img-container"]}>
                                                {
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img alt={"Fotografie z alba \"" + album.name + "\""} src={"/api/photo?file=" + photo + "&minify"} />
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
    </>;
};

export default AlbumsList;