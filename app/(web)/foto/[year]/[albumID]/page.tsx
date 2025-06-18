import { isLoggedForYear } from "@features/auth/lib/authFunc";
import AlbumsLoginContainer from "@features/web/components/AlbumsLoginForm/AlbumsLoginFormContainer";
import Album from "@features/web/components/page/album";
import { getYearAlbumsInfo } from "@features/web/lib/getYearAlbumsInfo";
import { redirect, RedirectType } from "next/navigation";


type AlbumPageProps = {
}

const AlbumPage = async ({params}: {params: Promise<{year: string, albumID: string}>}) => {
    const {year, albumID } = await params;
    const logged = await isLoggedForYear(year);
    let album;
    if(logged){
        album = (await getYearAlbumsInfo(year)).data?.find((album) => { return album.title === albumID });
    }
    
    return <div>
        {logged && <Album album={album} />}        
        {!logged && <AlbumsLoginContainer year={year} />}
    </div>
}

export default AlbumPage;