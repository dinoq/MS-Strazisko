import { FC, MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/types";
import Breadcrumb from "./Breadcrumb";
import { selectBreadcrumbItem } from "../../../store/reducers/BreadcrumbSlice";
import { SagaActions } from "../../../store/sagas";
import { setDBObject } from "../../../store/reducers/DBObjectSlice";
import useAppDispatch from "../../../hooks/useAppDispatch";

const BreadcrumbContainer: FC<{hideDetailFrame: MouseEventHandler<HTMLInputElement> } > = (props) => {
    const dispatch = useAppDispatch();
    const items = useSelector((state: RootState) => state.breadcrumb.items)
    //let items: Array<BreadcrumbItemDef> = props.items ? props.items : [];

    const itemClicked = (index) => {
        props.hideDetailFrame(undefined);
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: items[index].DBObject.DBOClass})
        dispatch(selectBreadcrumbItem(index))
        dispatch(setDBObject(items[index].DBObject));
        //props.setItems(prevState => [...items.slice(0, index + 1)]);
    }
    return (
        <Breadcrumb items={items} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;