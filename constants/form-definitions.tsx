import { ComponentType } from "./constants";
import { FormDef } from "./types";

interface FormDefs {
  [key: string]: FormDef;
}

const FormDefinitions: FormDefs = {
  albumPasswords: {
    hasBreadcrumb: true,
    detailFrame: {
      components: [
        {
          attributeKey: "id_albumPasswords",
          componentType: ComponentType.SELECTBOX,
          values: "getYears()"
        },
        {
          attributeKey: "passwordHash",
          componentType: ComponentType.INPUT,
          constraints: [{ condition: "$['#'].length", errorIfFail: "Musí být zvolen školní rok" }]
        }
      ]
    },
    listFrame: {
      detailDBOClass: "albums",
      actions:{
        delete: true,
        edit: true
      },
      components: [
        {
          attributeKey: "id_albumPasswords",
          attributeName: "Školní rok",
          isBreadcrumbKey: true
        },
        {
          attributeKey: "passwordHash",
          attributeName: "Heslo"
        }
      ]
    }
  },
};


export const getFormDefinition = (DBObjectClass: string): FormDef => {
  let def = FormDefinitions[DBObjectClass];
  
  return def;

}

