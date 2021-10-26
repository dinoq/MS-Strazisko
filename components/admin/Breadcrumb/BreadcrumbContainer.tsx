import { FC } from "react";
import { BreadcrumbItemDef } from "../../../src/types";
import Breadcrumb from "./Breadcrumb";
import classes from "./Breadcrumb.module.scss";

const BreadcrumbContainer: FC<{items: Array<BreadcrumbItemDef>, setItems: Function} > = (props) => {

    let items: Array<BreadcrumbItemDef> = props.items ? props.items : [];

    const resetNav = () => {
        props.setItems([]);
    }

    const itemClicked = (index) => {
        props.setItems(prevState => [...items.slice(0, index + 1)]);
    }
    return (
        <Breadcrumb items={items} resetNav={resetNav} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;