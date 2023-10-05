// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import DOMPurify from "dompurify";
import Image from "next/image";
import { FC } from "react";
import { ListFrameComponentType } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { DBObjectType, LFComponentDef, ListFrameActionsDef, ListFrameDef } from "../../../helpers/types";

type ListFrameProps = { 
    components: Array<LFComponentDef>,
    actions: ListFrameActionsDef,
    detailDBOClassLen: number,
    DBObject: DBObjectType, 
    detailClickedHandler: Function, 
    deleteItemHandler: Function, 
    editItemHandler: Function, 
    entries: Array<DBObjectType>, 
    colspanNoData: number 
}

const ListFrame: FC<ListFrameProps> = ({ 
    components,
    actions,
    detailDBOClassLen,
    DBObject, 
    detailClickedHandler, 
    deleteItemHandler, 
    editItemHandler, 
    entries, 
    colspanNoData 
}) => {
    console.log('components: ', components);

    return (
        <>
            <table className={""}>
                <thead>
                    <tr className={""}>
                        {detailDBOClassLen > 0 && <th className={""}>Detail</th>}
                        {components.map((item, index, array) => {
                            return <th key={"thtrtd-" + index} className={""}>{item.componentName}</th>
                        })}
                        {actions && <th className={""}>Akce</th>}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index, array) => {
                        return <tr key={"tbtr-" + index} className={(DBObject.id == entry.id) ? "selected-row" : ""}>
                            {detailDBOClassLen > 0 &&
                                <td className={""}>
                                    <span className="link" onClick={detailClickedHandler.bind(this, entry)}>Detail</span>
                                </td>}
                            {
                                components.map((component: LFComponentDef, index, array) => {

                                    let value: any = "";

                                    let evaluated = DBManager.substituteExpression(component.transformation, entry);

                                    if (component.componentType == ListFrameComponentType.TextField || component.componentType == ListFrameComponentType.RichTextField) {
                                        value = evaluated;

                                    } else if (component.componentType == ListFrameComponentType.ImagePreview) {
                                        evaluated = evaluated.startsWith("/") ? evaluated : "/" + evaluated;
                                        value = (
                                            <div className="ImagePreview">
                                                <Image src={evaluated} alt="Náhled obrázku" layout="fill" objectFit="contain" />
                                            </div>
                                        )
                                    } else if (component.componentType == ListFrameComponentType.DateField) {
                                        let date = new Date(evaluated);
                                        value = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
                                    }
                                    if (component.componentType == ListFrameComponentType.RichTextField) {
                                        value = DBManager.substituteTags(value, true);
                                        return <td key={"tbtrtd-" + index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}></td>;
                                    } else {
                                        return <td key={"tbtrtd-" + index}>{value}</td>;
                                    }
                                })}
                            {actions && <td className={"actions"}>
                                {actions.delete && <span className={"link link-danger"} onClick={deleteItemHandler.bind(this, entry, false)}>Smazat</span>}
                                {actions.edit && <span className={"link"} onClick={editItemHandler.bind(this, entry)}>Editovat</span>}
                            </td>}

                        </tr>
                    })}
                    {(colspanNoData != -1) &&
                        <tr>
                            <td colSpan={colspanNoData} className="text-center">Nenalezena žádná data!</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default ListFrame;