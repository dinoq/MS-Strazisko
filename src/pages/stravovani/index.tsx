// eslint-disable-next-line
import classes from "./Stravovani.module.scss";
import allergens from "../../../public/img/alergeny2.png";
import Image from "next/legacy/image"
import Link from "next/link";
import { useEffect, useState } from "react";

type StravovaniProps = {
    
}

const Stravovani: React.FC<StravovaniProps> = ({

}) => {
    const [imgUrls, setImgUrls] = useState<Array<{img_url: string}>>([]);
    useEffect(() => {
        fetch("/api/data?table=food").then((data) => {

            data.json().then(json => {
                setImgUrls(json.food);
            })
        })
    }, [])
    return <>
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10">
                    <h1 className="text-center mb-4">Stravování</h1>
                    <div className={classes.allergens + " position-relative"}>
                        <Link href={allergens.src} target="_blank"><h2>Seznam alergenů</h2>{/*<Image src={allergens} alt="Seznam alergenů" layout="fill" objectFit="contain" />*/}</Link>
                    </div>
                    {imgUrls.map((img, index)=>{
                        return (
                            <div key={"food-"+index} className={classes.food + " position-relative"}>
                                <Link href={img.img_url} target="_blank"><Image src={img.img_url} alt="Seznam alergenů" layout="fill" objectFit="contain" /></Link>
                            </div>
                        );
                    })}
                    {/* <div className={classes.food + " position-relative"}>
                        <Link href={food1.src}><a target="_blank"><Image src={food1} alt="Seznam alergenů" layout="fill" objectFit="contain" /></a></Link>
                    </div>
                    <div className={classes.food + " position-relative"}>
                        <Link href={food2.src}><a target="_blank"><Image src={food2} alt="Seznam alergenů" layout="fill" objectFit="contain" /></a></Link>
                    </div> */}
                </div>
            </div>
        </div>
    </>;
}

export default Stravovani;