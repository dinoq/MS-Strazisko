// eslint-disable-next-line
import classes from "./FotoDetail.module.scss";
import { useRouter } from 'next/router';
import Link from "next/link"

const AlbumDetail: React.FC<{}> = (props) => {
    const router = useRouter();
    const { fotoID: albumID } = router.query;

    return (
        <>
            <Gallery albumTitle={albumID} />
        </>
    )
}


const Gallery: React.FC<{ albumTitle: any }> = (props) => {
    let albums: Array<{ date: string, title: string, photos: Array<any> }> = [];
    /*
        const [photos, setPhotos] = useState([]);
    
    
        useEffect(() => {        
            let resp: any = fetch('http://localhost:3000/api/photos').then((value) => {
                console.log("QWER");
                value.json().then((value) => {
                    console.log('value: ', value);
                    setPhotos(["q.jpg"]);
                    
                })
            })
        }, [])*/
    let album = { date: "2020-05-05", title: "Výlet v přírodě 20. 5.", photos: ["q.jpg", "a.jpg", "b.jpg", "q.jpg", "a.jpg", "b.jpg", "q.jpg", "a.jpg", "b.jpg", "q.jpg", "a.jpg", "b.jpg", ] };

    let year = new Date(album.date).getFullYear();

    return (
        <>
            <div className={" container-fluid"}>
                    <div className="text-blue text-center h2 my-3">{album.title} {year}</div>
                    <div className="album-images-preview row justify-content-center">
                        <div className="col-12 col-md-10 row">
                            {album.photos.map((photo, index, array) => {
                                return (
                                    <div key={"photo-" + index + "-" + album.title + "-" + album.date} className={classes["overlay-container"] + " col-12 col-md-6 col-lg-3"}>
                                        <Link href={"/api/photo?file=" + photo}><a target="_blank"><div className={classes["overlay"]}></div></a></Link>
                                        <div className={classes["img-container"]}>
                                            {// eslint-disable-next-line @next/next/no-img-element
                                                photo && <img alt="TODO" src={"/api/photo?file=" + photo} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
            </div>
        </>
    )
}

export default AlbumDetail;