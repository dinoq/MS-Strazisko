import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, DBObjectEditedAttr, DFComponentDef, FormDef, FormDefs, LFComponentDef, OrderByDef, RecursivePartial, RootState } from "./types";
import clone from "clone";
import { getApiURL } from "./utils";
import { XMLParser } from "./XMLParser";

export class DBManager {



    public static fetchFormDefinitions = async (): Promise<FormDefs> => {
        return new Promise(async (res, rej) => {
            let response: any = await fetch(getApiURL("/admin/forms"),
                {
                    method: "GET",
                    mode: "same-origin"
                })

            try {
                if (response.status == 200) {
                    res(XMLParser.parseXMLFormDefinitions(await response.text()));
                } else {
                    throw new Error(await response.text());
                }
            } catch (error) {
                return error.message;
            }
        })
    }


    public static getDBObjectDefinition = (DBOClass: string): DBObject => {
        let obj: DBObject = getRawDBObjectDefinition(DBOClass);
        if (obj == undefined) {
            throw new Error("Error: Class '" + DBOClass + "' has not object defined!");
        }
        if (obj.DBOClass != DBOClass) {
            throw new Error("Error: Class '" + DBOClass + "' has has inconsistency in definition (has DBOClass='" + obj.DBOClass + "')!");
        }
        obj.attributes.forEach(attr => {
            if (attr.value == undefined) {
                attr.value = "";
            }
        });

        return clone(obj);
    }

    public static getEmptyDBObject = (DBOClass: string, condition: string = ""): DBObject => {
        let obj: DBObject = {
            DBOClass: DBOClass,
            id: -1,
            attributes: (DBOClass == undefined || DBOClass == "") ? [] : DBManager.getDBObjectDefinition(DBOClass).attributes,
            editedAttrs: [],
            isEdited: false
        }

        return clone(obj);
    }
    public static clearBinding = (key: string): string => {
        let newKey = key.replace("*", "");
        let verticalIndex = newKey.indexOf("|");
        if (verticalIndex != -1)
            newKey = newKey.substring(0, verticalIndex);
        return newKey;
    }
    protected static getAttrOrComponentFromArrByKey(arr: Array<DBObjectAttr | DBObjectEditedAttr | DFComponentDef | LFComponentDef>, key: string, type?: string): DBObjectAttr | LFComponentDef | DFComponentDef {
        let attr = arr.find(a => {
            if (Object.keys(a).includes("key")) {
                return DBManager.clearBinding(a["key"]) == DBManager.clearBinding(key);
            } else {
                return DBManager.clearBinding(a["attributeKey"]) == DBManager.clearBinding(key);
            }
        });

        if (type == "LFComponentDef") {
            return (attr as LFComponentDef) || { attributeKey: "", transformation: "", isBreadcrumbKey: false };
        } else if (type == "DFComponentDef") {
            return (attr as DFComponentDef) || { attributeKey: "", componentType: ComponentType.UNKNOWN, values: [], constraints: [], editable: true };
        } else {
            return (attr as DBObjectAttr) || { key: "", name: "", value: "" };
        }
    }


    public static getAttrFromArrByKey(arr: Array<DBObjectAttr | DBObjectEditedAttr>, key: string): DBObjectAttr {
        return DBManager.getAttrOrComponentFromArrByKey(arr, key) as DBObjectAttr;
    }

    public static getLFComponentFromArrByKey(arr: Array<LFComponentDef>, key: string): LFComponentDef {
        return (DBManager.getAttrOrComponentFromArrByKey(arr, key, "LFComonentDef") as LFComponentDef);
    }

    public static getDFComponentFromArrByKey(arr: Array<DFComponentDef>, key: string): DFComponentDef {
        return (DBManager.getAttrOrComponentFromArrByKey(arr, key, "DFComonentDef") as DFComponentDef);
    }

    public static getAllDBObjectEntries = async (DBOClass: string, /*orderBy: OrderByDef,*/ condition: string = ""): Promise<Array<DBObject>> => {
        if (DBOClass == undefined || DBOClass == "") {
            return [];
        } else {
            let order = "";
            /*if (orderBy.attr) {
                order = "&order=" + orderBy.attr + "|" + (orderBy.descending ? "DESC" : "ASC");
            }*/
            const resp = await fetch("/api/admin/data?className=" + DBOClass + (condition ? "&condition=" + condition : "") + order);
            if (resp.status == 200) {
                let entries = [];
                let json = await resp.json();
                for (const attributes of json) {
                    let entry = DBManager.getEmptyDBObject(DBOClass);
                    entry.id = attributes[Object.keys(attributes)[0]];
                    for (const attrName in attributes) {
                        entry.attributes[Object.keys(attributes).indexOf(attrName)].value = attributes[attrName];
                    }
                    entries.push(entry);
                }
                return entries;
            } else {
                let text = await resp.text();
                throw new Error("Error: database return no object data. Msg from server: " + text);
            }
        }

    }

    public static insertToDB = async (body: any, reload: boolean = true): Promise<any> => {
        return await DBManager.fetchDB(body, "POST", reload);
    }
    public static updateInDB = async (body: any, reload: boolean = true): Promise<any> => {
        return await DBManager.fetchDB(body, "PATCH", reload);
    }
    public static deleteInDB = async (body: any, reload: boolean = true): Promise<any> => {
        return await DBManager.fetchDB(body, "DELETE", reload);
    }
    protected static fetchDB = async (body: any, method: string, reload: boolean = true): Promise<any> => {
        const response = await fetch("/api/admin/data",
            {
                method,
                mode: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

        if (response.status == 200) {
            if (reload) {
                window.location.reload();
            }
        } else {
            let text = "";
            try {
                text = await response.text();
                return text;
            } catch (error) {
                return error.message;
            }
        }
    }

    public static checkClassAttrs = (attrs: Array<any>, DBOClass: string, tolerateMissingPrimaryKey = false): { success: boolean, errorMsg: string } => {
        let check = {
            success: true,
            errorMsg: ""
        }
        try {
            const DBObjectDefinitionAttrs: Array<DBObjectAttr> = DBManager.getDBObjectDefinition(DBOClass).attributes;
            for (const attrKey in attrs) { // Check if there is not any foreign attr
                if (!DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey)) {
                    check.success = false;
                    check.errorMsg = "ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + DBOClass + "'";
                }
            };
            let successExactMatch = Object.keys(attrs).length == DBObjectDefinitionAttrs.length;
            let successMatchWithoutPrimaryKeyIfTolerated = tolerateMissingPrimaryKey && Object.keys(attrs).length+1 == DBObjectDefinitionAttrs.length && attrs[DBObjectDefinitionAttrs[0].key] == undefined;
            if (!(successExactMatch || successMatchWithoutPrimaryKeyIfTolerated)) {
                check.success = false;
                check.errorMsg = "ERROR - Wrong attribute count!";
            }
        } catch (error) {
            console.log('error: ', error);
            check.success = false;
            check.errorMsg = "ERROR - unknown error when checking class attrs! For class '" + DBOClass + "'";
        }

        return check;
    }

    public static getBreadcrumbAttr = (DBObject: DBObject, formDefinition: FormDef): DBObjectAttr => {
        const breadcrumbComponent = formDefinition.listFrame.components.find(component => component.isBreadcrumbKey);
        if(breadcrumbComponent == undefined){
            throw new Error("ERROR - No breadcrumb item set in form definitions");
        }
        let key: string = breadcrumbComponent.attributeKey;
        return (DBManager.getAttrOrComponentFromArrByKey(DBObject.attributes, key) as DBObjectAttr);
    }
}
