import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbItemDef, RootState } from "../../../types";
import Breadcrumb from "./Breadcrumb";
import classes from "./Breadcrumb.module.scss";
import { selectBreadcrumbItem } from "../../../store/reducers/BreadcrumbReducer";
import { SagaActions } from "../../../store/sagas";
import { setDBObject } from "../../../store/reducers/DBObjectReducer";

const BreadcrumbContainer: FC<{} > = (props) => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.breadcrumb.items)
    //let items: Array<BreadcrumbItemDef> = props.items ? props.items : [];

    const resetNav = () => {
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: items[0].DBObject.DBOClass})
        dispatch(selectBreadcrumbItem(0))
        //props.setItems([]);
    }

    const itemClicked = (index) => {
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: items[index].DBObject.DBOClass})
        dispatch(selectBreadcrumbItem(index))
        dispatch(setDBObject(items[index].DBObject));
        //props.setItems(prevState => [...items.slice(0, index + 1)]);
    }
    return (
        <Breadcrumb items={items} resetNav={resetNav} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;