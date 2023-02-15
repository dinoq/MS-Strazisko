import { FC, MouseEventHandler } from "react";
import { BreadcrumbItemDef } from "../../../helpers/types";
import classes from "./Breadcrumb.module.scss";

const Breadcrumb: FC<{ items: Array<BreadcrumbItemDef>, itemClicked: MouseEventHandler<any> }> = (props) => {

    return (
        <>
            {
                (props.items.length != 0) &&
                <div className={classes.breadcrumb}>
                    {props.items.length > 0 &&
                        <span className={classes.breadcrumbItemWrapper}>
                            <span className={classes.breadcrumbItem + " link fw-normal"} onClick={props.itemClicked.bind(this, 0)}>
                                🏠
                            </span>
                        </span>
                    }
                    {props.items.length > 0 && props.items.slice(0).map((item, index) => {
                        return (
                            <span key={"breadcrumb-item-" + index} className={classes.breadcrumbItemWrapper}>
                                {" > "}
                                <span className={classes.breadcrumbItem + " link" + (!item.text ? " fw-normal" : "")} onClick={props.itemClicked.bind(this, index + 1)}>
                                    {item.text ? item.text : "???"}
                                </span>
                            </span>
                        )
                    })}
                </div>
            }
        </>
    )
}

export default Breadcrumb;