import Albums from "@features/web/components/page/albums";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import { jwtAlbumToken } from "@features/auth/types";
import { getYearAlbumsInfo } from "@features/web/lib/getYearAlbumsInfo";
import { AlbumInfo } from "@features/data/lib/types";
import { isLoggedForYear } from "@features/auth/lib/authFunc";

type AlbumsPageProps = {
    params: Promise<{ year: string }>
}

const AlbumsPage = async ({params}: AlbumsPageProps) => {
    const { year } = await params;
    let yearAlbumsInfo: Array<AlbumInfo> = [];
    let logged = await isLoggedForYear(year);
    
    if(logged){
        yearAlbumsInfo = (await getYearAlbumsInfo(year, 6)).data || [];
    }


    /*


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const session = await getIronSession(req, res, sessionOptions);
    if (!req.url) {

        return {
            props: { logged: false },
        };
    }
    const fotoIndex = req.url.indexOf("foto/") + 5;
    const pageYear = req.url.substring(fotoIndex, fotoIndex + 9).replace("_", "/");
    const loggedForYears: Array<string> | undefined = (session as any).loggedForYears;

    if (
        loggedForYears &&
        loggedForYears.length &&
        loggedForYears.includes(pageYear)
    ) {

        return {
            props: { logged: true },
        };
    } else {
        return {
            props: { logged: false },
        };
    }
}



    */

    return <Albums logged={logged} yearAlbumsInfo={yearAlbumsInfo} />
}

export default AlbumsPage;