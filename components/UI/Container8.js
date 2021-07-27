// eslint-disable-next-line
//import classes from "./Container8.css";

const Container8 = (props) => {

    return (
        <>
            <div className="col-2"></div>
            <div className={"col-8 " + (props.classes ? props.classes : "")}>{props.children}</div>
            <div className="col-2"></div>
        </>
    )
}

export default Container8;