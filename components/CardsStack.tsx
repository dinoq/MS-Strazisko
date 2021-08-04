// eslint-disable-next-line
//import classes from "../styles/CardsStack.module.scss";

import React from "react";

const defaultProps = {
    minColumn: 1,
    additionalClasses : ""
}

const CardsStack: React.FC<{ minColumn?: number, additionalClasses?: string }> = (props) => {
    const childCount = (props.children as any).length;

    const minColumn = props.minColumn || defaultProps.minColumn;
    const additionalClasses = props.additionalClasses || defaultProps.additionalClasses;

    let classes = `col-${Math.floor(12/minColumn)} col-md-6 col-lg-${Math.floor(12/childCount)}`;

    return (
        <>
        {
        React.Children.map(props.children, (child: React.ReactElement<any>) => 
        <div className={classes + " " + additionalClasses}>
            {child}           
        </div>)}
        </>
    )
}

export default CardsStack;