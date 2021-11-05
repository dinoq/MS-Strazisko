import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbItemDef, RootState } from "../../../types";
import Breadcrumb from "./Breadcrumb";
import classes from "./Breadcrumb.module.scss";
import { selectBreadcrumbItem } from "./BreadcrumbReducer";

const BreadcrumbContainer: FC<{} > = (props) => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.breadcrumb.items)
    console.log('itemsssssss: ', items);
    //let items: Array<BreadcrumbItemDef> = props.items ? props.items : [];

    const resetNav = () => {
        dispatch(selectBreadcrumbItem(0))
        //props.setItems([]);
    }

    const itemClicked = (index) => {
        dispatch(selectBreadcrumbItem(index))
        //props.setItems(prevState => [...items.slice(0, index + 1)]);
    }
    return (
        <Breadcrumb items={items} resetNav={resetNav} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;