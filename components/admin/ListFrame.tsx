// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useEffect, useState } from "react";
import { FormDefinitions } from "../../constants/form-definitions";
import { DBObject, FormDefinition } from "../../constants/types";
import AppTable from "../Table/Table";

const ListFrame: FC<{ formClassName: string, DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function }> = (props) => {
    let formDefinition = FormDefinitions[props.formClassName];
    console.log('formDefinitionnn: ', formDefinition);
    let headerItems = (formDefinition && formDefinition.items) ? formDefinition.items : [];
    const [entries, setEntries] = useState([])
    /*
        if (props.formClass?.config?.detail) {
            rows.push({ content: <span onClick={props.detailClickedHandler.bind(this, props.DBObject)}> Detail </span>, className: "link" });
        }
    */

    useEffect(() => {
        console.log('props.formClassName: ', props.formClassName);
        fetch("/api/admin/data?className=" + props.formClassName).then((resp) => {
            if (resp.status == 200) {
                resp.json().then((json) => {
                    setEntries(json);
                });
            } else {
                resp.text().then((value) => {
                    console.log("tvalue: ", value);
                });
            }
        });
    }, [props.formClassName]);

    return (
        <>
            <table className={""}>
                <thead>
                    <tr className={""}>
                        {formDefinition?.config?.detailClass && <th className={""}>Detail</th>}
                        {headerItems.map((item, index, array) => {
                            return <th key={"thtrtd-" + index} className={""}>{item.content}</th>
                        })}
                        {formDefinition?.config?.actions && <th className={""}>Akce</th>}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index, array) => {
                        return <tr key={"tbtr-" + index} className={(JSON.stringify(props.DBObject) == JSON.stringify(entry)) ? "selected-row" : ""}>
                            {formDefinition?.config?.detailClass && <td className={""}><span className="link" onClick={props.detailClickedHandler.bind(this, entry)}> Detail </span></td>}
                            {
                                formDefinition.items.map((item, index, array) => {
                                    return <td key={"tbtrtd-" + index}>{entry[item.objectParamName]}</td>;
                                })}
                            {formDefinition?.config?.actions && <td className={"actions"}>
                                {formDefinition?.config?.actions.delete && <span className={"link link-danger"} onClick={props.deleteItemHandler.bind(this, entry)}>Smazat</span>}
                                {formDefinition?.config?.actions.delete && <span className={"link"} onClick={props.editItemHandler.bind(this, entry)}>Editovat</span>}
                            </td>}

                        </tr>
                    })}
                    {(!entries || !entries.length) &&
                        <tr>
                            <td colSpan={headerItems.length} className="text-center">Nenalezena žádná data!</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default ListFrame;