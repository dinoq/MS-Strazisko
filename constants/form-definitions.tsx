import { ComponentType } from "./constants";
import { FormDef } from "./types";

interface FormDefs {
  [key: string]: FormDef;
}

export const FormDefinitions: FormDefs = {
  albumPasswords: {
    config: {
      detailClass: "albums",
      actions: {
        delete: true,
        edit: true
      }
    },
    attributes: [
      {
        name: "id_albumPasswords",
        props: {
          content: "Školní rok", breadcrumb: true, inDetail: true, inList: true, type: ComponentType.SELECTBOX, values: "getYears()", constraints: [{ condition: "$['#'].length", errorIfFail: "Musí být zvolen školní rok" }]
        }
      },
      {
        name: "passwordHash",
        props: {
          content: "Heslo", inDetail: true, inList: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
    ]
  },

  albums: {
    config: {
      detailClass: "photos",
      actions: {
        delete: true,
        edit: true
      }
    },
    attributes: [
      {
        name: "id_album",
        props: {
          content: "id_album", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "date",
        props: {
          content: "date", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "title",
        props: {
          content: "title", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "id_albumPasswords",
        props: {
          content: "id_albumPasswords", inDetail: true, parentBinding: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "name",
        props: {
          content: "name", breadcrumb: true, inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
    ]
  },

  photos: {
    config: {
      actions: {
        delete: true,
        edit: true
      }
    },
    attributes: [
      {
        name: "id_photo",
        props: {
          content: "id_photo", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "filename",
        props: {
          content: "filename", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }]
        }
      },
      {
        name: "id_album",
        props: { content: "id_album", inDetail: true, type: ComponentType.INPUT, inputType: "text", constraints: [{ condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!" }, { condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!" }] }
      },
    ]
  },

}
