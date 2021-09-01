// eslint-disable-next-line
import classes from "./Stravovani.module.scss";
import allergens from "../../public/img/alergeny2.png";
import food1 from "../../public/img/jidelna1.png";
import food2 from "../../public/img/jidelna2.png";
import Image from "next/image"

const Stravovani: React.FC<{ propname: any }> = (props) => {
    
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-8">
                        <h1 className="text-center mb-4">Stravování</h1>
                        <div className={classes.allergens + " position-relative"}>
                            <Image src={allergens} alt="Seznam alergenů" layout="fill" objectFit="contain" />
                        </div>
                        <div className={classes.food + " position-relative"}>
                            <Image src={food1} alt="Seznam alergenů" layout="fill" objectFit="contain" />
                        </div>
                        <div className={classes.food + " position-relative"}>
                            <Image src={food2} alt="Seznam alergenů" layout="fill" objectFit="contain" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Stravovani;