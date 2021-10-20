import { ComponentType } from "./constants";
import { FormDefinition } from "./types";

interface FormDefinitions {
  [key: string]: FormDefinition;
}

export const FormDefinitions: FormDefinitions = {
  albumPasswords:{
      config: {
        detailClass: "albums",
        actions: {
          delete: true,
          edit: true
        }
      },
      items:[
        { content: "Školní rok", objectParamName: "id_albumPasswords",                    breadcrumb: true, editable: true, type: ComponentType.SELECTBOX, values: "getYears()", constraints: [{condition: "$['#'].length", errorIfFail: "Musí být zvolen školní rok"}] },
        { content: "Heslo", objectParamName: "passwordHash",                              editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
      ]
  },

  albums:{
      config: {
        detailClass: "photos",
        actions: {
          delete: true,
          edit: true
        }
      },
      items:[
        { content: "id_album", objectParamName: "id_album",                               editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "date", objectParamName: "date",                                       editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "title", objectParamName: "title",                                     editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "id_albumPasswords", objectParamName: "id_albumPasswords",             editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "name", objectParamName: "name",                                       breadcrumb: true, editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
      ]
  },

  photos:{
      config: {
        actions: {
          delete: true,
          edit: true
        }
      },
      items:[
        { content: "id_photo", objectParamName: "id_photo",                               editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "filename", objectParamName: "filename",                                       editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "id_album", objectParamName: "id_album",                                     editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
      ]
  },

  documents:{
      config: {
        actions: {
          delete: true,
          edit: true
        }
      },
      items:[
        { content: "id_documents", objectParamName: "id_documents",                               editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "name", objectParamName: "name",                                       editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
        { content: "url", objectParamName: "url",                                     editable: true, editableInEditMode: true, type: ComponentType.INPUT, inputType: "text", constraints: [{condition: "$['#'].length", errorIfFail: "Heslo nesmí být prázdné!"}, {condition: "$['#'].length > 5", errorIfFail: "Heslo nesmí být kratší než 6 znaků!"}] },
      ]
  }
}