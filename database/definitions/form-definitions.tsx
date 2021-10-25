import { ComponentType } from "../../constants/constants";
import { FormDef } from "../../constants/types";
import { getYears } from "./values-definitions";

interface FormDefs {
  [key: string]: FormDef;
}

const FormDefinitions: FormDefs = {
  albumPasswords: {
    detailFrame: {
      components: [
        {
          attributeKey: "id_albumPasswords",
          componentType: ComponentType.SELECTBOX,
          values: getYears()
        },
        {
          attributeKey: "passwordHash",
          constraints: [{ condition: "$.length >= 6", errMsgIfFail: "Heslo musí obsahovat alespoň 6 znaků!" }]
        }
      ],
      createNewEntryText: "Přidat školní rok"
    },
    listFrame: {
      detailDBOClass: "albums",
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

export const getRawFormDefinition = (DBObjectClass: string): FormDef => {
  return FormDefinitions[DBObjectClass];
}