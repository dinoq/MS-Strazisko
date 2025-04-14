import { FC, MouseEventHandler } from "react";
import { BreadcrumbItemDef } from "../../../../FilesToDistribute/types";
import classes from "./Breadcrumb.module.scss";

type BreadcrumbProps = { 
    items: Array<BreadcrumbItemDef>, 
    itemClicked: MouseEventHandler<any> 
}

const Breadcrumb: FC<BreadcrumbProps> = ({ 
    items, 
    itemClicked
}) => {

    return (
        <>
            {
                (items.length != 0) &&
                <div className={classes.breadcrumb}>
                    {items.length > 0 &&
                        <span className={classes.breadcrumbItemWrapper}>
                            <span className={classes.breadcrumbItem + " link fw-normal"} onClick={itemClicked.bind(this, 0)}>
                                🏠
                            </span>
                        </span>
                    }
                    {items.length > 0 && items.slice(0).map((item, index) => {
                        return (
                            <span key={"breadcrumb-item-" + index} className={classes.breadcrumbItemWrapper}>
                                {" > "}
                                <span className={classes.breadcrumbItem + " link" + (!item.text ? " fw-normal" : "")} onClick={itemClicked.bind(this, index + 1)}>
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