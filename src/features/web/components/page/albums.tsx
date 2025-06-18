"use client"

import { useParams } from "next/navigation";
import AlbumsList from "../AlbumsList/AlbumsList";
import AlbumsLoginContainer from "../AlbumsLoginForm/AlbumsLoginFormContainer";
import { formatYear } from "lib/utils";
import { YearFormat } from "lib/types";
import { AlbumInfo } from "@features/data/lib/types";


type AlbumsPageProps = {
    logged: boolean,
    yearAlbumsInfo: Array<AlbumInfo>
}

const Albums: React.FC<AlbumsPageProps> = ({
    logged,
    yearAlbumsInfo
}) => {
    let year = formatYear((useParams<{year: string}>()?.year as string), YearFormat.SLASH);

    return (
        <>
            <div className="container-fluid">
                <div className={" row my-4 justify-content-center align-items-center"}>
                    <div className="col-10">
                        {logged && <AlbumsList year={year} yearAlbumsInfo={yearAlbumsInfo} />}
                        {!logged && <AlbumsLoginContainer year={year} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Albums;