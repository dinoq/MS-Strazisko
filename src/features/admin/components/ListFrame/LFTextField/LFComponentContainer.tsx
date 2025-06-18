import { FC } from "react";
import { ListFrameComponentType } from "../../../../../FilesToDistribute/constants";
import { DBObjectType } from "../../../../../FilesToDistribute/types";
import { DBManager } from "../../../../data/lib/DBManager";
import LFComponent from "./LFComponent";
import { substituteTags } from "lib/editorUtils";
//import styles from "./LFComponentContainer.module.scss";

type LFComponentContainerProps = {
    componentType: ListFrameComponentType,
    transformation?: string,
    entry: DBObjectType
}



const LFComponentContainer: FC<LFComponentContainerProps> = ({
    componentType,
    transformation,
    entry
}) => {

    let value: any = "";
    let evaluated = DBManager.substituteExpression(transformation, entry);

    switch (componentType) {
        case ListFrameComponentType.Text:
        case ListFrameComponentType.Link:
            value = evaluated;
            break;
        case ListFrameComponentType.RichTextField:
            value = substituteTags(evaluated, true);
            break;
        case ListFrameComponentType.ImagePreview:
            evaluated = evaluated.startsWith("/") ? evaluated : "/" + evaluated;
            break;
        case ListFrameComponentType.Date:
            let date = new Date(evaluated);
            value = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
            break;
    }

    return (
        <LFComponent componentType={ componentType } evaluated={ evaluated } />
    )
}

export default LFComponentContainer;