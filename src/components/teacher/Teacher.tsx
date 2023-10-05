// eslint-disable-next-line
import classes from "./Teacher.module.scss";
import Image from "next/image";

type TeacherProps = { 
    imgSrc: any, 
    name: string, 
    description: string 
}

const Teacher: React.FC<TeacherProps> = ({ 
    imgSrc, 
    name, 
    description
}) => {

    return (
        <div className="d-flex flex-column align-items-center">
            <div className={classes["photo-container"] + " position-relative"}>
                <Image src={imgSrc} alt={"fotka učitele/ky"} layout="fill" objectFit="cover" />
            </div>
            <div className={classes["text-container"] + " d-flex justify-content-center"}>
                <div className={classes.text + " "}>
                    <div className={classes.name + " "}>
                        {name}
                    </div>
                    <div className={classes.description + " "}>
                        {description}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teacher;