// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useEffect, useState } from "react";
import { FormDefinitions } from "../../../constants/form-definitions";
import { DBObject, FormDef, ListFrameDef } from "../../../constants/types";
import ListFrame from "./ListFrame";

const ListFrameContainer: FC<{ DBObjectClass: string, DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function }> = (props) => {
    let formDefinition = FormDefinitions[props.DBObjectClass].listFrame;
    return (
        <>
            {formDefinition && <ListFrame definition={formDefinition} />}
        </>
    )
}

export default ListFrameContainer;