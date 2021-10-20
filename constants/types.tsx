import { ComponentType } from "./constants"

export type FormDefinition = {
  config: {
    detailClass?: string,
    actions?: {
      delete: boolean,
      edit: boolean
    }
  },
  items: Array<FormDefinitionItem>

}


export type FormDefinitionItem = {
    content: any,
    breadcrumb?: boolean,
    editable?: boolean,
    editableInEditMode?: boolean,
    type?: ComponentType,
    inputType?: string,
    values?: Array<any> | string,
    objectParamName?: string,
    constraints?: Array<FormDefinitionItemConstraint>
}

export type FormDefinitionItemConstraint = {
    condition: string,
    errorIfFail: string    
}

export type DBObject = {
    id: number,  
}
