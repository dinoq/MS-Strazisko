import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { getRawFormDefinition } from "../database/definitions/form-definitions";
import { getEmptyValues } from "../database/definitions/values-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, DBObjectEditedAttr, DFComponentDef, FormDef, LFComponentDef, OrderByDef, RecursivePartial } from "./types";
import clone from "clone";
import { Interface } from "readline";

export class DBManager {


    protected static _defaultDefinition: RecursivePartial<FormDef> = {
        detailFrame: {
            components: [
                {
                    componentType: ComponentType.INPUT,
                    inputType: "text",
                    values: getEmptyValues(),
                    editable: true,
                    constraints: [
                        {
                            condition: "",
                            errMsgIfFail: ""
                        }
                    ]
                }
            ],
            createNewEntryText: "",
            uniqueConstraintFailed: "Při vkládání do databáze došlo k problému kvůli vkládání již existujícího unikátního klíče.<br/>Unikátní atributy vyžadují unikátní hodnotu!"
        },
        listFrame: {
            detailDBOClass: "",
            actions: {
                delete: true,
                edit: true
            },
            components: [
                {
                    isBreadcrumbKey: false,
                    transformation: ""
                }
            ],
            cantDeleteItemMsg: "Chyba! Daný záznam zřejmě obsahuje nějaká podřízená data.<br>Nejprve musíte smazat je a až potom tento záznam!"
        },
        DB: {
            orderBy: {
                descending: false
            }
        }
    }

    protected static _isNumBoolStr = object => (typeof object == "number" || typeof object == "boolean" || typeof object == "string");

    public static getFormDefinition = (DBObjectClass: string): FormDef => {
        let def = getRawFormDefinition(DBObjectClass);
        if (def == undefined) {
            throw new Error("Error: Class '" + DBObjectClass + "' has not form defined!");
        }
        DBManager.createFullDef(DBManager._defaultDefinition, def);
        //Kontrola atributů...
        const dbObjectAttrKeys: Array<DBObjectAttr | any> = DBManager.getDBObjectDefinition(DBObjectClass)?.attributes?.map(attr => attr.key);
        if (!dbObjectAttrKeys || !dbObjectAttrKeys.length) {
            throw new Error("Error: Class '" + DBObjectClass + "' has not any attributes!");
        }
        for (const attr of def.detailFrame.components) {
            if (!dbObjectAttrKeys.includes(attr.attributeKey)) {
                throw new Error("Error: Form attribute '" + attr.attributeKey + "' (from DetailFrame definition) is not member of object class '" + DBObjectClass + "'!");
            }
        }
        for (const attr of def.listFrame.components) {
            if (!dbObjectAttrKeys.includes(attr.attributeKey)) {
                throw new Error("Error: Form attribute '" + attr.attributeKey + "' (from ListFrame definition) is not member of object class '" + DBObjectClass + "'!");
            }
        }
        //Kotrola atributu orderBy, pokud je nastaven
        if (def.DB.orderBy.attr) {
            if (!dbObjectAttrKeys.includes(def.DB.orderBy.attr)) {
                throw new Error("Error: Form attribute '" + def.DB.orderBy.attr + "' (from orderBy definition) is not member of object class '" + DBObjectClass + "'!");
            }
        }
        return clone(def);
    }

    public static createFullDef = (defaultDefTree, formDefTree) => {
        for (const childKey in defaultDefTree) {
            if (DBManager._isNumBoolStr(defaultDefTree[childKey])) {
                if (formDefTree[childKey] == undefined) {
                    formDefTree[childKey] = defaultDefTree[childKey];
                }
            } else {
                if (Array.isArray(defaultDefTree[childKey])) { // Kontrola na pole musí být před kontrolou na objekt, protože typeof [] = "object"
                    if (!formDefTree[childKey]) {
                        formDefTree[childKey] = [];
                    } else {
                        formDefTree[childKey].forEach(arrayItem => {
                            DBManager.createFullDef(defaultDefTree[childKey][0], arrayItem);
                        });
                    }
                } else if (typeof defaultDefTree[childKey] == "object") {
                    if (!formDefTree[childKey]) {
                        formDefTree[childKey] = {};
                    }
                    DBManager.createFullDef(defaultDefTree[childKey], formDefTree[childKey])
                }
            }
        }
    }


    public static getDBObjectDefinition = (DBObjectClass: string): DBObject => {
        let obj: DBObject = getRawDBObjectDefinition(DBObjectClass);
        if (obj == undefined) {
            throw new Error("Error: Class '" + DBObjectClass + "' has not object defined!");
        }
        if (obj.DBObjectClass != DBObjectClass) {
            throw new Error("Error: Class '" + DBObjectClass + "' has has inconsistency in definition (has DBObjectClass='" + obj.DBObjectClass + "')!");
        }
        obj.attributes.forEach(attr => {
            if (attr.value == undefined) {
                attr.value = "";
            }
        });
        return clone(obj);
    }

    public static getEmptyDBObject = (DBObjectClass: string, condition: string = ""): DBObject => {
        let obj: DBObject = {
            DBObjectClass,
            id: -1,
            attributes: DBManager.getDBObjectDefinition(DBObjectClass).attributes,
            editedAttrs: [],
            isEdited: false
        }

        return clone(obj);
    }

    protected static getAttrOrComponentFromArrByKey(arr: Array<DBObjectAttr | DBObjectEditedAttr | DFComponentDef | LFComponentDef>, key: string, type?: string): DBObjectAttr | LFComponentDef | DFComponentDef {
        let attr =  arr.find(a => {
            if(Object.keys(a).includes("key")){
                return a["key"] == key;
            }else{
                return a["attributeKey"] == key;
            }
        });
        
        if(type == "LFComponentDef"){
            return (attr as LFComponentDef) || {attributeKey: "", transformation: "", isBreadcrumbKey: false};
        } else if(type == "DFComponentDef"){
            return (attr as DFComponentDef) || {attributeKey: "", componentType: ComponentType.UNKNOWN, inputType: "", values: [], constraints: [], editable: true};
        } else{
            return (attr as DBObjectAttr) || {key: "", name: "", value: ""};
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

    public static getAllDBObjectEntries = async (DBObjectClass: string, orderBy: OrderByDef, condition: string = ""): Promise<Array<DBObject>> => {
        let order = "";
        if (orderBy.attr) {
            order = "&order=" + orderBy.attr + "|" + (orderBy.descending ? "DESC" : "ASC");
        }
        const resp = await fetch("/api/admin/data?className=" + DBObjectClass + (condition ? "&condition=" + condition : "") + order);
        if (resp.status == 200) {
            let entries = [];
            let json = await resp.json();
            for (const attributes of json) {
                let entry = DBManager.getEmptyDBObject(DBObjectClass);
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

    public static checkClassAttrs = (attrs: any, DBObjectClass: string): { success: boolean, errorMsg: string } => {
        let check = {
            success: true,
            errorMsg: ""
        }
        try {
            const DBObjectDefinitionAttrs: Array<DBObjectAttr> = DBManager.getDBObjectDefinition(DBObjectClass).attributes;
            for (const attrKey in attrs) {
                if (!DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey)) {
                    check.success = false;
                    check.errorMsg = "ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + DBObjectClass + "'";
                }
            };
            if (Object.keys(attrs).length != DBObjectDefinitionAttrs.length) {
                check.success = false;
                check.errorMsg = "ERROR - Wrong attribute count!";
            }
        } catch (error) {
            check.success = false;
            check.errorMsg = "ERROR - unknown error when checking class attrs! For class '" + DBObjectClass + "'";
        }

        return check;
    }

    public static getBreadcrumbAttr = (DBObject: DBObject): DBObjectAttr =>{
        let key: string = this.getFormDefinition(DBObject.DBObjectClass).listFrame.components.find(component=>component.isBreadcrumbKey).attributeKey;
        return (this.getAttrOrComponentFromArrByKey(DBObject.attributes, key) as DBObjectAttr);
    }
}
