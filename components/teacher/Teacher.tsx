// eslint-disable-next-line
import classes from "./Teacher.module.scss";
import Image from "next/image";

const Teacher: React.FC<{ imgSrc: any, name: string, description: string }> = (props) => {

    return (
        <div className="d-flex flex-column align-items-center">
            <div className={classes["photo-container"] + " position-relative"}>
                <Image src={props.imgSrc} alt={"fotka učitele/ky"} layout="fill" objectFit="cover" />
            </div>
            <div className={classes["text-container"] + " d-flex justify-content-center"}>
                <div className={classes.text + " "}>
                    <div className={classes.name + " "}>
                        {props.name}
                    </div>
                    <div className={classes.description + " "}>
                        {props.description}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teacher;