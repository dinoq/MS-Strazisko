import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { getEmptyValues } from "../database/definitions/values-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, DBObjectEditedAttr, DFComponentDef, FormDef, FormDefs, LFComponentDef, OrderByDef, RecursivePartial, RootState } from "./types";
import clone from "clone";
import { Interface } from "readline";
import { getApiURL } from "./utils";
import * as ValuesDefinitions from "../database/definitions/values-definitions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToBreadcrumb } from "./store/reducers/BreadcrumbReducer";
import { SagaActions } from "./store/sagas";

export class DBManager {


    public static _defaultDefinition: RecursivePartial<FormDef> = {
        detailFrame: {
            components: [
                {
                    componentType: ComponentType.TextField,
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
            },
            DBOClass: ""
        }
    }

    protected static _isNumBoolStr = object => (typeof object == "number" || typeof object == "boolean" || typeof object == "string");
    /*
        public static getFormDefinitions = async (DBOClass: string): Promise<FormDef> => {
        }*/

    public static fetchFormDefinitions = async (): Promise<FormDefs> => {
        return new Promise(async (res, rej) => {
            let response: any = await fetch(getApiURL("/admin/forms"),
                {
                    method: "GET",
                    mode: "same-origin"
                })

            try {
                if (response.status == 200) {
                    let parser = new DOMParser();
                    let xmlDef = parser.parseFromString(await response.text(), "text/xml");
                    res(DBManager.parseXMLFormDefinitions(xmlDef));
                } else {
                    throw new Error(await response.text());
                }
            } catch (error) {
                return error.message;
            }
        })
    }

    private static parseXMLFormDefinitions = async (xmlDef: XMLDocument): Promise<FormDefs> => {

        let getREQUIREDAttrFromXML = (attrName: string, XML: Element) => {
            if (!XML.getAttribute(attrName)) {
                throw new Error(`ERROR: Required attribute '${attrName}' missing in form definition!`)
            }
            return XML.getAttribute(attrName);
        }
        let getOptionalAttrFromXML = (attrName: string, XML: Element, defaultVal?: any) => {
            if (!XML.getAttribute(attrName)) {
                return (defaultVal !== undefined)? defaultVal : "";
            }
            return XML.getAttribute(attrName);
        }

        let mapToComponentType = (type: string) => {
            switch (type) {
                case "SelectBox":
                    return ComponentType.SelectBox;

                case "TextField":
                    return ComponentType.TextField;
                case "NumberField":
                    return ComponentType.NumberField;
                case "DateField":
                    return ComponentType.DateField;
                default:
                    throw new Error("Uknown componentType ('" + type + "') in form definition!")
                    return ComponentType.UNKNOWN;

            }
        }
        let defs = {};
        let forms = Array.from(xmlDef.documentElement.children);
        forms.forEach(form => {
            let def: FormDef = DBManager.createFullDef(DBManager._defaultDefinition, {});

            // DETAIL FRAME DEF
            let XMLDF = form.getElementsByTagName("DetailFrame")[0];
            let XMLDFComponents = Array.from(XMLDF.getElementsByTagName("Component"));
            for (const XMLcomponent of XMLDFComponents) {
                let component: DFComponentDef = {
                    attributeKey: ""
                };
                component.attributeKey = getREQUIREDAttrFromXML("attributeKey", XMLcomponent);
                component.componentType = mapToComponentType(getOptionalAttrFromXML("componentType", XMLcomponent));
                let constraints = getOptionalAttrFromXML("constraints", XMLcomponent, new Array());
                component.constraints = (constraints.length) ? JSON.parse(constraints) : "";
                component.editable = getOptionalAttrFromXML("editable", XMLcomponent).toLowerCase() != "false";
                let values = getOptionalAttrFromXML("values", XMLcomponent);
                if (values.length) {
                    component.values = ValuesDefinitions[values]();
                }

                def.detailFrame.components.push(component);
            }
            def.detailFrame.createNewEntryText = getOptionalAttrFromXML("createNewEntryText", XMLDF);
            def.detailFrame.uniqueConstraintFailed = getOptionalAttrFromXML("uniqueConstraintFailed", XMLDF);

            // LIST FRAME DEF
            let XMLLF = form.getElementsByTagName("ListFrame")[0];
            let XMLLFComponents = Array.from(XMLDF.getElementsByTagName("Component"));
            for (const XMLcomponent of XMLLFComponents) {
                let component: LFComponentDef = {
                    attributeKey: ""
                };
                component.attributeKey = getREQUIREDAttrFromXML("attributeKey", XMLcomponent);
                component.isBreadcrumbKey = getOptionalAttrFromXML("isBreadcrumbKey", XMLcomponent).toLowerCase() == "true";
                component.transformation = getOptionalAttrFromXML("transformation", XMLcomponent);

                def.listFrame.components.push(component);
            }

            def.listFrame.detailDBOClass = getOptionalAttrFromXML("detailDBOClass", XMLLF);
            let actions = getOptionalAttrFromXML("actions", XMLLF);
            def.listFrame.actions = (actions.length) ? { ...def.listFrame.actions, ...JSON.parse(actions) } : def.listFrame.actions;
            def.listFrame.cantDeleteItemMsg = getOptionalAttrFromXML("cantDeleteItemMsg", XMLLF);
            let orderByAttr = getOptionalAttrFromXML("orderBy", form.getElementsByTagName("ListFrame")[0]);
            let orderByDESC = getOptionalAttrFromXML("descending", form.getElementsByTagName("ListFrame")[0]);
            if (orderByAttr.length) {
                def.DB.orderBy.attr = orderByAttr;
                def.DB.orderBy.descending = orderByDESC.toLowerCase() == "true";
            }

            let formName = form.getAttribute("FID")
            def.DB.DBOClass = formName;
            defs[formName] = def;
        })

        return defs;
    }
    /*
    public static getFormDefinition = async (DBOClass: string): Promise<FormDef> => {
        //return null;
        let def = getRawFormDefinition(DBOClass);
        if (def == undefined) {
            throw new Error("Error: Class '" + DBOClass + "' has not form defined!");
        }
        DBManager.createFullDef(DBManager._defaultDefinition, def);
        //Kontrola atributů...
        const dbObjectAttrKeys: Array<DBObjectAttr | any> = DBManager.getDBObjectDefinition(DBOClass)?.attributes?.map(attr => attr.key);
        if (!dbObjectAttrKeys || !dbObjectAttrKeys.length) {
            throw new Error("Error: Class '" + DBOClass + "' has not any attributes!");
        }
        for (const attr of def.detailFrame.components) {
            if (!dbObjectAttrKeys.includes(attr.attributeKey)) {
                throw new Error("Error: Form attribute '" + attr.attributeKey + "' (from DetailFrame definition) is not member of object class '" + DBOClass + "'!");
            }
        }
        for (const attr of def.listFrame.components) {
            if (!dbObjectAttrKeys.includes(attr.attributeKey)) {
                throw new Error("Error: Form attribute '" + attr.attributeKey + "' (from ListFrame definition) is not member of object class '" + DBOClass + "'!");
            }
        }
        //Kotrola atributu orderBy, pokud je nastaven
        if (def.DB.orderBy.attr) {
            if (!dbObjectAttrKeys.includes(def.DB.orderBy.attr)) {
                throw new Error("Error: Form attribute '" + def.DB.orderBy.attr + "' (from orderBy definition) is not member of object class '" + DBOClass + "'!");
            }
        }

        return clone(def);
    }*/

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
        return formDefTree;
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
        console.log('formDefinition: ', formDefinition);
        const breadcrumbComponent = formDefinition.listFrame.components.find(component => component.isBreadcrumbKey);
        if(breadcrumbComponent == undefined){
            throw new Error("ERROR - No breadcrumb item set in form definitions");
        }
        let key: string = breadcrumbComponent.attributeKey;
        return (DBManager.getAttrOrComponentFromArrByKey(DBObject.attributes, key) as DBObjectAttr);
    }
}
