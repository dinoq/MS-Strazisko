// eslint-disable-next-line
//import classes from "./SchoolFeature.module.css";
import Image from "next/image"


const SchoolFeature: React.FC<{icon: any, title: string, description: string, alt: string}> = (props) => {
    console.log('icon: ', props.icon);
    
    console.log('icon: ', typeof props.icon);
    console.log('icon: ', typeof props.title);
    
    return (
        <>
            <div className="col-3 d-flex flex-column">
                <Image src={props.icon} alt={props.alt}/>
                <h3 className={"my-2"}><u><strong>{props.title}</strong></u></h3>
                <p>{props.description}</p>
              </div>
        </>
    )
}

export default SchoolFeature;