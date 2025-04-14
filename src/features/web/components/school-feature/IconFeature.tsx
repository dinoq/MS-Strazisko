// eslint-disable-next-line
import Image from "next/legacy/image"
import styles from "./IconFeature.module.scss"

type IconFeatureProps = {
    icon: any, 
    title: string, 
    description: string, 
    alt: string, 
    bgColor: string
}

const IconFeature: React.FC<IconFeatureProps> = ({
    icon, 
    title, 
    description, 
    alt, 
    bgColor
}) => {
    
    return (
        <>
            {/* <div className="col-6 col-lg-3 d-flex flex-column align-items-center"> */}
                <div className={styles["circle-bh-container"] + " d-flex flex-column align-items-center"}>
                    <div style={{backgroundColor: bgColor}} className={styles["circle-bg"]}>
                        
                        {// eslint-disable-next-line @next/next/no-img-element
                        <img src={icon} alt={alt} width="60" height="60"/>}
                    </div>
                </div>
                <h3 className={"my-2"}><u><strong>{title}</strong></u></h3>
                <p>{description}</p>
              {/* </div> */}
        </>
    )
}

export default IconFeature;