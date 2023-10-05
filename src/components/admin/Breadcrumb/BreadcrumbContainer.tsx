import { FC, MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/types";
import Breadcrumb from "./Breadcrumb";
import { selectBreadcrumbItem } from "../../../store/reducers/BreadcrumbSlice";
import { SagaActions } from "../../../store/sagas";
import { setDBObject } from "../../../store/reducers/DBObjectSlice";
import useAppDispatch from "../../../hooks/useAppDispatch";

type BreadcrumbContainerProps = {
    hideDetailFrame: MouseEventHandler<HTMLInputElement> 
}

const BreadcrumbContainer: FC<BreadcrumbContainerProps> = ({
    hideDetailFrame
}) => {
    const dispatch = useAppDispatch();
    const items = useSelector((state: RootState) => state.breadcrumb.items)

    const itemClicked = (index) => {
        hideDetailFrame(undefined);
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: items[index].DBObject.DBOClass})
        dispatch(selectBreadcrumbItem(index))
        dispatch(setDBObject(items[index].DBObject));
    }
    return (
        <Breadcrumb items={items} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;