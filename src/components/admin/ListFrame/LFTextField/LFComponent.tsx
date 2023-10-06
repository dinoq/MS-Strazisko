import { FC } from "react";
import { ListFrameComponentType } from "../../../../helpers/constants";
import Image from "next/image";
import DOMPurify from "dompurify";
//import styles from "./LFComponent.module.scss";

type LFComponentProps = {
    componentType: ListFrameComponentType,
    evaluated: string
}

const LFComponent: FC<LFComponentProps> = ({
    componentType,
    evaluated,
}) => {

    if (componentType == ListFrameComponentType.TextField) {
        return (
            <div className={""}>
                {evaluated}
            </div>
        )
    } else if (componentType == ListFrameComponentType.DateField) {
        return (
            <div className={""}>
                {evaluated}
            </div>
        )
    } else if (componentType == ListFrameComponentType.ImagePreview) {
        return (
            <div className={""}>
                <div className="ImagePreview">
                    <Image src={evaluated} alt="Náhled obrázku" layout="fill" objectFit="contain" />
                </div>
            </div>
        )
    } else if (componentType == ListFrameComponentType.RichTextField) {
        return (
            <div className={""}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(evaluated) }}></div>
            </div>
        )
    }
}

export default LFComponent;
