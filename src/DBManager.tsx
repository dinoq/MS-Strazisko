import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, DFComponentDef, FormDef, FormDefs, LFComponentDef, OrderByDef, RecursivePartial, RootState } from "./types";
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
                    const definition = await response.text();
                    res(XMLParser.parseXMLFormDefinitions(definition));
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

        if (obj.persistentAttributes == undefined) {
            obj.persistentAttributes = [];
        }

        obj.persistentAttributes.forEach(attr => {
            if (attr.value == undefined) {
                attr.value = "";
            }
        });

        return clone(obj);
    }

    public static getEmptyDBObject = (DBOClass: string): DBObject => {
        let obj: DBObject = {
            DBOClass: DBOClass,
            id: -1,
            attributes: (DBOClass == undefined || DBOClass == "") ? [] : DBManager.getDBObjectDefinition(DBOClass).attributes,
            persistentAttributes: (DBOClass == undefined || DBOClass == "") ? [] : DBManager.getDBObjectDefinition(DBOClass).persistentAttributes,
            editedAttrs: [],
            isEdited: false
        }

        return clone(obj);
    }

    public static getClearedDBObject = (DBObject: DBObject): DBObject => {
        let obj: DBObject = {
            DBOClass: DBObject.DBOClass,
            id: -1,
            attributes: DBObject.attributes.map(attr => {
                return {
                    key: attr.key,
                    value: ""
                }
            }),
            persistentAttributes: clone(DBObject.persistentAttributes),
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
    protected static getAttrOrComponentFromArrByKey(arr: Array<DBObjectAttr | DFComponentDef | LFComponentDef>, key: string, type?: string): DBObjectAttr | LFComponentDef | DFComponentDef {
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
            return (attr as DBObjectAttr) || { key: "", value: "" };
        }
    }


    public static getAttrFromArrByKey(arr: Array<DBObjectAttr>, key: string): DBObjectAttr {
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
                    for (const attrKey in attributes) {
                        if (entry.attributes.find(attr => attr.key == attrKey)) { // Nepersistent attribute
                            entry.attributes[entry.attributes.findIndex(attr => attr.key == attrKey)].value = attributes[attrKey];
                        } else if (entry.persistentAttributes.find(attr => (attr.key == attrKey || attr.key == ("*"+attrKey)))) { // Persistent attribute
                            let attrIndex = entry.persistentAttributes.findIndex(attr => attr.key == attrKey);
                            attrIndex = (attrIndex == -1)? entry.persistentAttributes.findIndex(attr => attr.key == "*"+attrKey) : attrIndex;
                            entry.persistentAttributes[attrIndex].value = attributes[attrKey];
                        } else { // Error
                            throw new Error(`ERROR - From server (database) come attribute '${attrKey}' of class '${DBOClass}' which is not part of this class definition!`)
                        }
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
            const DBObjectDefinitionPersistentAttrs: Array<DBObjectAttr> = DBManager.getDBObjectDefinition(DBOClass).persistentAttributes;
            for (const attrKey in attrs) { // Check if there is not any foreign attr
                if (!(DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey) || DBObjectDefinitionPersistentAttrs.find(definitionAttr => definitionAttr.key == attrKey))) {
                    check.success = false;
                    check.errorMsg = "ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + DBOClass + "'";
                }
            };
            let successExactMatch = Object.keys(attrs).length == DBObjectDefinitionAttrs.length;
            let successMatchWithoutPrimaryKeyIfTolerated = tolerateMissingPrimaryKey && Object.keys(attrs).length + 1 == DBObjectDefinitionAttrs.length && attrs[DBObjectDefinitionAttrs[0].key] == undefined;
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
        if (breadcrumbComponent == undefined) {
            throw new Error("ERROR - No breadcrumb item set in form definitions");
        }
        let key: string = breadcrumbComponent.attributeKey;
        return (DBManager.getAttrOrComponentFromArrByKey(DBObject.attributes, key) as DBObjectAttr);
    }
}
