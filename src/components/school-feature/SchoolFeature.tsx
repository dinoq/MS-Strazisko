// eslint-disable-next-line
import Image from "next/image"
import styles from "./SchoolFeature.module.scss"


const SchoolFeature: React.FC<{icon: any, title: string, description: string, alt: string, bgColor: string}> = (props) => {
    
    return (
        <>
            {/* <div className="col-6 col-lg-3 d-flex flex-column align-items-center"> */}
                <div className={styles["circle-bh-container"] + " d-flex flex-column align-items-center"}>
                    <div style={{backgroundColor: props.bgColor}} className={styles["circle-bg"]}>
                        
                        {// eslint-disable-next-line @next/next/no-img-element
                        <img src={props.icon} alt={props.alt} width="60" height="60"/>}
                    </div>
                </div>
                <h3 className={"my-2"}><u><strong>{props.title}</strong></u></h3>
                <p>{props.description}</p>
              {/* </div> */}
        </>
    )
}

export default SchoolFeature;