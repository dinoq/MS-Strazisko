import { FC } from "react";
import { ListFrameComponentType } from "../../../../helpers/constants";
import { DBObjectType } from "../../../../helpers/types";
import { DBManager } from "../../../../helpers/DBManager";
import LFComponent from "./LFComponent";
//import styles from "./LFComponentContainer.module.scss";

type LFComponentContainerProps = {
    componentType: ListFrameComponentType,
    transformation: string,
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
        case ListFrameComponentType.TextField:
            value = evaluated;
            break;
        case ListFrameComponentType.RichTextField:
            value = DBManager.substituteTags(evaluated, true);
            break;
        case ListFrameComponentType.ImagePreview:
            evaluated = evaluated.startsWith("/") ? evaluated : "/" + evaluated;
            break;
        case ListFrameComponentType.DateField:
            let date = new Date(evaluated);
            value = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
            break;
    }

    return (
        <LFComponent componentType={ componentType } evaluated={ evaluated } />
    )
}

export default LFComponentContainer;