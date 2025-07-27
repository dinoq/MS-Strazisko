import { getRawDBObjectDefinition } from "../definitions/db-object-definitions";
import { DetailFrameComponentType } from "../../../FilesToDistribute/constants";
import { DBObjectType, DBObjectAttr, DBOClassType, DFComponentDef, FormDef, FormDefs, LFComponentDef, OrderByDef } from "../../../FilesToDistribute/types";
import clone from "clone";
import { XMLParser } from "../../../FilesToDistribute/XMLParser";
import { ServerResponse } from "./types";

export class DBManager {



    public static fetchFormDefinitions = async (): Promise<FormDefs> => {
        return new Promise(async (res, rej) => {
            let response: any = await fetch("/api/admin/forms",
                {
                    method: "GET",
                    mode: 'cors',
                    credentials: 'include'
                })

            try {
                if (response.status == 200) {
                    const definition = (await response?.json())?.data?.definitions;
                    if(definition){
                        res(XMLParser.parseXMLFormDefinitions(definition));
                    }
                } else {
                    throw new Error(await response.json());
                }
            } catch (error) {
                return error.message;
            }
        })
    }


    public static getDBObjectDefinition = (DBOClass: DBOClassType): DBObjectType => {
        let obj: DBObjectType;
        if (DBOClass === undefined)
            obj = DBManager.getEmptyDBObject(undefined);
        else
            obj = getRawDBObjectDefinition(DBOClass);

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

    public static getEmptyDBObject = (DBOClass: DBOClassType): DBObjectType => {
        let obj: DBObjectType = {
            DBOClass: DBOClass,
            id: -1,
            attributes: (DBOClass == undefined || DBOClass == "") ? [] : DBManager.getDBObjectDefinition(DBOClass).attributes,
            persistentAttributes: (DBOClass == undefined || DBOClass == "") ? [] : DBManager.getDBObjectDefinition(DBOClass).persistentAttributes,
            editedAttrs: [],
            isEdited: false
        }

        return clone(obj);
    }

    public static getClearedDBObject = (DBObject: DBObjectType): DBObjectType => {
        let obj: DBObjectType = {
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
            return (attr as DFComponentDef) || { attributeKey: "", componentType: DetailFrameComponentType.UNKNOWN, values: [], constraints: [], editable: true };
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

    protected static getAttrVal(key: string, dbObject: DBObjectType, fromOriginalAttrValues: boolean = false) {
        if (!fromOriginalAttrValues && dbObject.editedAttrs.findIndex((attr) => { return attr.key == key }) > -1) { // Key is in EDITED attributes (has priority over not-edited attrs)
            return DBManager.getAttrFromArrByKey(dbObject.editedAttrs, key).value
        } else if (dbObject.attributes.findIndex((attr) => { return attr.key == key }) > -1) { // Key is in attributes
            return DBManager.getAttrFromArrByKey(dbObject.attributes, key).value
        } else if (dbObject.persistentAttributes.findIndex((attr) => { return attr.key == key }) > -1) { // Key is in persistent attributes
            return DBManager.getAttrFromArrByKey(dbObject.persistentAttributes, key).value
        } else {// else error?

        }
    };

    /**
     * Function converts expression to expression with values (converts all @[attrKey] to real value)
     * @param rawExpression source expression to substitute
     * @param dbObject Database object from where get data for substitution
     * @param fromOriginalAttrValues if true, get values from original attributes before editing, otherwise from edited attributes
     * @returns substituted expression (with real values)
     */
    public static substituteExpression(rawExpression: string | undefined, dbObject: DBObjectType, fromOriginalAttrValues: boolean = false): string {
        if (rawExpression === undefined)
            return "";
        let rawExpressionSplitted = rawExpression.split(/@\[(.*?)\]/g);
        let substituted = "";
        for (let i = 0; i < rawExpressionSplitted.length; i++) {
            if (i % 2 == 1) {
                substituted = substituted.concat(DBManager.getAttrVal(rawExpressionSplitted[i], dbObject, fromOriginalAttrValues));// remove @[attrKey] (=> val of attr of attrKey)
            } else {
                substituted = substituted.concat(rawExpressionSplitted[i]);
            }
        }
        return substituted;
    }


    public static getAllDBObjectEntries = async (DBOClass: DBOClassType, orderBy: OrderByDef | undefined, condition: string = ""): Promise<Array<DBObjectType>> => {
        if (DBOClass == undefined || DBOClass == "") {
            return [];
        } else {
            let order = "";
            if (orderBy !== undefined && orderBy.attr) {
                order = "&order=" + orderBy.attr + "|" + (orderBy.descending ? "desc" : "asc");
            }
            const resp = await fetch("/api/admin/data?className=" + DBOClass + (condition ? "&condition=" + condition : "") + order);
            if (resp.status == 200) {
                let entries: Array<DBObjectType> = [];
                let json = (await resp.json())?.data || [];
                for (const attributes of json) {
                    let entry = DBManager.getEmptyDBObject(DBOClass);
                    entry.id = attributes[Object.keys(attributes)[0]];
                    for (const attrKey in attributes) {
                        if (entry.attributes.find(attr => attr.key == attrKey)) { // Nepersistent attribute
                            entry.attributes[entry.attributes.findIndex(attr => attr.key == attrKey)].value = attributes[attrKey];
                        } else if (entry.persistentAttributes.find(attr => (attr.key == attrKey || attr.key == ("*" + attrKey)))) { // Persistent attribute
                            let attrIndex = entry.persistentAttributes.findIndex(attr => attr.key == attrKey);
                            attrIndex = (attrIndex == -1) ? entry.persistentAttributes.findIndex(attr => attr.key == "*" + attrKey) : attrIndex;
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

    public static insertToDB = async (body: any, reload: boolean = true): Promise<ServerResponse> => {
        return await DBManager.fetchDB(body, "POST", reload);
    }
    public static updateInDB = async (body: any, reload: boolean = true): Promise<ServerResponse> => {
        return await DBManager.fetchDB(body, "PATCH", reload); // TODO nemělo by tu být PUT?
    }
    public static deleteInDB = async (body: any, reload: boolean = true): Promise<ServerResponse> => {
        return await DBManager.fetchDB(body, "DELETE", reload);
    }

    protected static fetchDB = async (body: any, method: string, reload: boolean = true): Promise<ServerResponse> => {
        return await DBManager.callAPI("data", JSON.stringify(body), method, reload, "application/json");
    }

    protected static callAPI = async (handlerName: string, body: string | FormData, method: string, reload: boolean, contentType: string | undefined): Promise<ServerResponse> => {
        console.log('handlerName: ', handlerName);
        let init: RequestInit =
        {
            method,
            mode: "same-origin",
            body: body
        }
        if (contentType && contentType.length) {
            init["headers"] = { "Content-Type": contentType };
        }

        const response = await fetch("/api/admin/" + handlerName, init)

        if (response.status == 200) {
            if (method != "GET" && reload) {
                console.log('reload: ', reload, handlerName);
                /*let breadcrumbItems = store.getState()?.breadcrumb?.items;
                let state = store.getState();
                let dbObject = store.getState()?.dbObject
                if (breadcrumbItems.length) {

                    let item: DBObjectType = breadcrumbItems[breadcrumbItems.length - 1].DBObject as DBObjectType;

detailItemCondition - formát?
                    let detailItemCondition = `WHERE ${item.attributes[0].key}='${DBManager.getAttrFromArrByKey(breadcrumbItems[breadcrumbItems.length - 1].DBObject.attributes, item.attributes[0].key).value}'`;

                    DBManager.getAllDBObjectEntries(dbObject.DBOClass, selectActualFormDefinition(state).DB?.orderBy, detailItemCondition).then(entrs => {
                        store.dispatch(setEntries(entrs));
                    })
                } else {*/
                    window.location.reload();
                //}
            }
        } else {
            let json;
            try {
                json = await response.json();
                console.log('json: ', json);
                return json;
            } catch (error) {
                return {
                    message: error.message,
                    type: "error"
                }
            }
        }

        return {
            message: "",
            type: "information"
        }
    }

    public static runServerMethod = async (methodName: string, params: Array<string>, reload: boolean = true): Promise<ServerResponse> => {
        let body = {
            methodName,
            params
        }
        return await DBManager.callAPI("method", JSON.stringify(body), "POST", reload, "application/json");
    }

    public static sendFiles = async (files: Array<File>, path: string): Promise<ServerResponse> => {
        const body = new FormData();
        let index = 0;
        for (const file of files) {
            body.append("file" + (index), file);
            body.append("path" + (index++), path);
        }
        return await DBManager.callAPI("file", body, "POST", true, undefined);
    }

    public static checkClassAttrs = (attrs: Array<any>, DBOClass: DBOClassType, tolerateMissingPrimaryKey = false): { success: boolean, errorMsg: string } => {
        let check = {
            success: true,
            errorMsg: ""
        }

        if (DBOClass == undefined) {
            throw new Error("Cannot check class attrs, because class is undefined!");
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

    public static getBreadcrumbAttr = (DBObject: DBObjectType, formDefinition: FormDef): DBObjectAttr => {
        const breadcrumbComponent = formDefinition.listFrame.components.find(component => component.isBreadcrumbKey);
        if (breadcrumbComponent == undefined) {
            throw new Error("ERROR - No breadcrumb item set in form definitions");
        }
        let key: string = breadcrumbComponent.attributeKey;
        return (DBManager.getAttrOrComponentFromArrByKey(DBObject.attributes, key) as DBObjectAttr);
    }
}
