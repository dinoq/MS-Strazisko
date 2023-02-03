// eslint-disable-next-line
import classes from "./Stravovani.module.scss";
import allergens from "../../../public/img/alergeny2.png";
import food1 from "../../../public/img/jidelna1.png";
import food2 from "../../../public/img/jidelna2.png";
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";

const Stravovani: React.FC<{ propname: any }> = (props) => {

    const [imgUrls, setImgUrls] = useState<Array<{img_url: string}>>([]);
    useEffect(() => {
        fetch("/api/data?table=food").then((data) => {

            data.json().then(json => {
                setImgUrls(json.food);
            })
        })
    }, [])
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        <h1 className="text-center mb-4">Stravování</h1>
                        <div className={classes.allergens + " position-relative"}>
                            <Link href={allergens.src}><a target="_blank"><Image src={allergens} alt="Seznam alergenů" layout="fill" objectFit="contain" /></a></Link>
                        </div>
                        {imgUrls.map((img, index)=>{
                            return (
                                <div key={"food-"+index} className={classes.food + " position-relative"}>
                                    <Link href={img.img_url}><a target="_blank"><Image src={img.img_url} alt="Seznam alergenů" layout="fill" objectFit="contain" /></a></Link>
                                </div>
                            )
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
        </>
    )
}

export default Stravovani;