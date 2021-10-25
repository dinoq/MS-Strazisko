import { FC, MouseEventHandler } from "react";
import classes from "./Breadcrumb.module.scss";

const Breadcrumb: FC<{ items: Array<string>, resetNav: MouseEventHandler<any>, itemClicked: MouseEventHandler<any> }> = (props) => {

    return (
        <div className={classes.breadcrumb}>
            <span className={classes.breadcrumbItem + " link"} onClick={props.resetNav}>
                🏠
            </span>&nbsp;&gt;&nbsp;
            {props.items.map((item, index) => {
                return (
                    <span key={"breadcrumb-item-" + index} className={""}>
                        {index != 0 && " > "}
                        <span className={classes.breadcrumbItem + " link"} onClick={props.itemClicked.bind(this, index)}>
                            {item}
                        </span>
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb;