import Photo from "@features/web/components/page/photo";
import getPhotosYears from "@features/web/lib/getPhotosYears";



const PhotosPage = async () => {    
    const yearsArray = await getPhotosYears();

    return <Photo years={yearsArray} />
}

export default PhotosPage;