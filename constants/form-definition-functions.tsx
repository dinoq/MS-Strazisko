import { getRawDBObjectDefinition } from "../database/definitions/db-object-definitions";
import { getRawFormDefinition } from "../database/definitions/form-definitions";
import { getEmptyValues } from "../database/definitions/values-definitions";
import { ComponentType } from "./constants";
import { DBObject, DBObjectAttr, FormDef, RecursivePartial } from "./types";
import clone from "clone";

const defaultDefinition: RecursivePartial<FormDef> = {
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
            errorIfFail: ""
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

export const getFormDefinition = (DBObjectClass: string): FormDef => {
  let def = getRawFormDefinition(DBObjectClass);
  if (def == undefined) {
    throw new Error("Error: Class '" + DBObjectClass + "' has not form defined!");
  }
  createFullDef(defaultDefinition, def);
  //Kontrola atributů...
  const dbObjectAttrKeys: Array<DBObjectAttr | any> = getDBObjectDefinition(DBObjectClass)?.attributes?.map(attr => attr.key);
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

const createFullDef = (defaultDefTree, formDefTree) => {
  for (const childKey in defaultDefTree) {
    if (isNumBoolStr(defaultDefTree[childKey])) {
      if (!formDefTree[childKey]) {
        formDefTree[childKey] = defaultDefTree[childKey];
      }
    } else {
      if (Array.isArray(defaultDefTree[childKey])) { // Kontrola na pole musí být před kontrolou na objekt, protože typeof [] = "object"
        if (!formDefTree[childKey]) {
          formDefTree[childKey] = [];
        } else {
          formDefTree[childKey].forEach(arrayItem => {
            createFullDef(defaultDefTree[childKey][0], arrayItem);
          });
        }
      } else if (typeof defaultDefTree[childKey] == "object") {
        if (!formDefTree[childKey]) {
          formDefTree[childKey] = {};
        }
        createFullDef(defaultDefTree[childKey], formDefTree[childKey])
      }
    }
  }
}

const isNumBoolStr = object => (typeof object == "number" || typeof object == "boolean" || typeof object == "string");

export const getDBObjectDefinition = (DBObjectClass: string): DBObject => {
  let obj: DBObject = getRawDBObjectDefinition(DBObjectClass);
  if (obj == undefined) {
    throw new Error("Error: Class '" + DBObjectClass + "' has not object defined!");
  }
  if (obj.DBObjectClass != DBObjectClass) {
    throw new Error("Error: Class '" + DBObjectClass + "' has has inconsistency in definition (has DBObjectClass='" + obj.DBObjectClass + "')!");
  }
  obj.attributes.forEach(attr => {
    if(attr.value == undefined){
      attr.value = "";
    }
  });
  return clone(obj);
}

export const getEmptyDBObject = (DBObjectClass: string, condition: string = ""): DBObject =>{
  let obj: DBObject = {
    DBObjectClass,
    id: -1,
    attributes: getDBObjectDefinition(DBObjectClass).attributes,
    editedAttrs: [],
    isEdited: false
  }

  return clone(obj);
}

export const getAllDBObjectEntries = async (DBObjectClass: string, condition: string = ""): Promise<Array<DBObject>> => {
  const resp = await fetch("/api/admin/data?className=" + DBObjectClass + (condition ? "&condition=" + condition : ""));

  if (resp.status == 200) {
    let entries = [];
    let json = await resp.json();
    for (const attributes of json) {
      let entry = getEmptyDBObject(DBObjectClass);
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