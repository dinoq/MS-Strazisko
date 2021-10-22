import { ComponentType } from "./constants"



export type DBObject = {
  id: number, 
  attrs: Array<any>, 
  editedAttrs: Array<any> 
}

export type FormDef = {
  config: {
    detailClass?: string,
    actions?: {
      delete: boolean,
      edit: boolean
    }
  },
  attributes: Array<FormAttrDef>
}


export type FormAttrDef = {
  name: string,
  props: FormAttrPropsDef
}

export type FormAttrPropsDef = {
    content: any,
    breadcrumb?: boolean,
    inDetail?: boolean,
    inList?: boolean,
    type?: ComponentType,
    parentBinding?: boolean,
    inputType?: string,
    values?: Array<any> | string,
    constraints?: Array<FormAttrConstraintDef>
}

export type FormAttrConstraintDef = {
    condition: string,
    errorIfFail: string    
}

