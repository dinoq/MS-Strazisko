import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../FilesToDistribute/types";
import Breadcrumb from "./Breadcrumb";
import { breadcrumbItemSelected } from "../../../../store/reducers/BreadcrumbSlice";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { SagaActions } from "@store/sagaActions"

type BreadcrumbContainerProps = {
    hideDetailFrame: () => void
}

const BreadcrumbContainer: FC<BreadcrumbContainerProps> = ({
    hideDetailFrame
}) => {
    const dispatch = useAppDispatch();
    const items = useSelector((state: RootState) => state.breadcrumb.items)

    const itemClicked = (index) => {
        console.log('index: ', index);
        hideDetailFrame();
        console.log('items: ', items);
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: items[index].DBObject.DBOClass})
        dispatch(breadcrumbItemSelected({index, items}))
    }
    return (
        <Breadcrumb items={items} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;