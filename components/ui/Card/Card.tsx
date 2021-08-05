// eslint-disable-next-line
import classes from "./Card.module.scss";

const Card: React.FC<{ additionalStyles?: object }> = ({children, additionalStyles}) => {
    return (
        <div className={classes.card} style={{...additionalStyles}}>
            {children}
        </div>
    )
}

export default Card;