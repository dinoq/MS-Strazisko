import { ComponentType } from "./constants"
import store from "./store"

/**
 * ########
 * DBObject
 * ########
 */
export type DBObject = {
    id: number,
    DBObjectClass: string,
    attributes: Array<DBObjectAttr>,
    isEdited: boolean,
    editedAttrs: Array<DBObjectEditedAttr>
}

export type DBObjectAttr = {
    key: string,
    name: string,
    value: any
}

export type DBObjectEditedAttr = {
    key: string,
    value: any
}

/**
 * ###############
 * FORM DEFINITION
 * ###############
 */
export type FormDef = {
    detailFrame: DetailFrameDef,
    listFrame: ListFrameDef,
    DB?: {
        orderBy?: OrderByDef
    }
    //DBOClass: string,???? - bude bez toho vedet co "tahat"??
}

export type FormDefs = {
    [key: string]: FormDef;
}


export type DetailFrameDef = {
    components: Array<DFComponentDef>,
    createNewEntryText?: string,
    uniqueConstraintFailed?: string,
}

export type DFComponentDef = {
    attributeKey: string,
    componentType?: ComponentType,
    inputType?: string,
    values?: Array<any>,
    constraints?: Array<FormAttrConstraintDef>,
    editable?: boolean
}


export type FormAttrConstraintDef = {
    condition: string,
    errMsgIfFail: string
}

export type ListFrameDef = {
    components: Array<LFComponentDef>,
    detailDBOClass?: string,
    actions?: {
        delete?: boolean,
        edit?: boolean
    },
    cantDeleteItemMsg?: string
}

export type LFComponentDef = {
    attributeKey: string,
    transformation?: string
    isBreadcrumbKey?: boolean,
}

export type OrderByDef = {
    attr: string,
    descending?: boolean
}

export type BreadcrumbItemDef = {
    DBObjectClass: string,
    DBObject: DBObject,
    text: string
}

/**
 * ############
 * REDUX STATES
 * ############
 */

export type RootState = ReturnType<typeof store.getState>

export interface BreadcrumbState {
    items: Array<any>
}

export interface FormDefinitionsState {
    definitions: FormDefs,
    actualFormDefinition: FormDef,
    definitionsLoaded: boolean
}

/**
 * #########
 * UTILITIES
 * #########
 */
export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] | RecursivePartial<T[P]>;
};

declare module "iron-session" {
    interface IronSessionData {
        adminLogged?: boolean;
        loggedForYears?: Array<string>
    }
}