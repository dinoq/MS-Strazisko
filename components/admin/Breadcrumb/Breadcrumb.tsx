import { FC, MouseEventHandler } from "react";
import { BreadcrumbItemDef } from "../../../src/types";
import classes from "./Breadcrumb.module.scss";

const Breadcrumb: FC<{ items: Array<BreadcrumbItemDef>, resetNav: MouseEventHandler<any>, itemClicked: MouseEventHandler<any> }> = (props) => {

    return (
        <div className={classes.breadcrumb}>
            <span className={classes.breadcrumbItem + " link"} onClick={props.resetNav}>
                🏠
            </span>&nbsp;&gt;&nbsp;
            {props.items.slice(1).map((item, index) => {
                return (
                    <span key={"breadcrumb-item-" + index} className={""}>
                        {index != 0 && " > "}
                        <span className={classes.breadcrumbItem + " link"} onClick={props.itemClicked.bind(this, index)}>
                            {item.text}
                        </span>
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb;