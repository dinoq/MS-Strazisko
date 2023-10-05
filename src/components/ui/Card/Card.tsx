
import classes from "./Card.module.scss";

type CardProps = { 
    additionalStyles?: object 
}

const Card: React.FC<CardProps> = ({
    children, 
    additionalStyles
}) => {
    return (
        <div className={classes.card} style={{...additionalStyles}}>
            {children}
        </div>
    )
}

export default Card;