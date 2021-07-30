// eslint-disable-next-line
//import classes from "./SchoolFeature.module.css";
import Image from "next/image"
import styles from "../styles/SchoolFeature.module.scss"


const SchoolFeature: React.FC<{icon: any, title: string, description: string, alt: string, bgColor: string}> = (props) => {
    
    return (
        <>
            <div className="col-3 d-flex flex-column align-items-center">
                <div className={styles["circle-bh-container"]}>
                    <div style={{backgroundColor: props.bgColor}} className={styles["circle-bg"]}>
                        <Image src={props.icon} alt={props.alt}/>
                    </div>
                </div>
                <h3 className={"my-2"}><u><strong>{props.title}</strong></u></h3>
                <p>{props.description}</p>
              </div>
        </>
    )
}

export default SchoolFeature;