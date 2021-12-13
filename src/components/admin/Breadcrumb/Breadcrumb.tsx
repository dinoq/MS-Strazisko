import { FC, MouseEventHandler } from "react";
import { BreadcrumbItemDef } from "../../../types";
import classes from "./Breadcrumb.module.scss";

const Breadcrumb: FC<{ items: Array<BreadcrumbItemDef>, resetNav: MouseEventHandler<any>, itemClicked: MouseEventHandler<any> }> = (props) => {

    return (
        <div className={classes.breadcrumb}>
            {props.items.length > 0 && props.items.slice(0).map((item, index) => {
                return (
                    <span key={"breadcrumb-item-" + index} className={classes.breadcrumbItemWrapper}>
                        {index != 0 && " > "}
                        <span className={classes.breadcrumbItem + " link" + (!item.text? " fw-normal" : "")} onClick={props.itemClicked.bind(this, index)}>
                            {item.text? item.text : "🏠"}
                        </span>
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb;