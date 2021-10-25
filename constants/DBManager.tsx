import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { getRawFormDefinition } from "../database/definitions/form-definitions";
import { getEmptyValues } from "../database/definitions/values-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, FormDef, RecursivePartial } from "./types";
import clone from "clone";

export class DBManager {


  protected static _defaultDefinition: RecursivePartial<FormDef> = {
    hasBreadcrumb: false,
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
      createNewEntryText: ""
    },
    listFrame: {
      detailDBOClass: "",
      actions: {
        delete: true,
        edit: true
      },
      components: [
        {
          isBreadcrumbKey: false
        }
      ]
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
    return clone(def);
  }

  public static createFullDef = (defaultDefTree, formDefTree) => {
    for (const childKey in defaultDefTree) {
      if (DBManager._isNumBoolStr(defaultDefTree[childKey])) {
        if (!formDefTree[childKey]) {
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

  public static getAllDBObjectEntries = async (DBObjectClass: string, condition: string = ""): Promise<Array<DBObject>> => {
    const resp = await fetch("/api/admin/data?className=" + DBObjectClass + (condition ? "&condition=" + condition : ""));
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
  public static insertDB = async (body: any, reload: boolean = true): Promise<any> => {
    return await DBManager.fetchDB(body, "POST", reload);
  }
  public static updateDB = async (body: any, reload: boolean = true): Promise<any> => {
    return await DBManager.fetchDB(body, "PATCH", reload);
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

}
