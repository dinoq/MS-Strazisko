import { ComponentType } from "./constants"
import store from "../store"

/**
 * ########
 * DBObject
 * ########
 */
export type DBObjectType = {
    id: number,
    DBOClass: DBOClassType,
    attributes: Array<DBObjectAttr>,
    persistentAttributes: Array<DBObjectAttr>,
    editedAttrs: Array<DBObjectAttr>,
    filesToUpload: Array<File>,
    isEdited: boolean
}

export type DBObjectAttr = {
    key: string,
    value: any,
    source?: string
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
        orderBy?: OrderByDef,
        DBOClass: DBOClassType,
    }
    //DBOClass: DBOClassType,???? - bude bez toho vedet co "tahat"??
}

export type DBOClassType = string | undefined;

export type FormDefs = {
    [key: string]: FormDef;
}


export type DetailFrameDef = {
    components: Array<DFComponentDef>,
    createNewEntryText?: string,
    uniqueConstraintFailed?: string,
    afterSaveMethod?: string,
}

export type DFComponentDef = {
    attributeKey: string,
    componentName?: string,
    componentType?: ComponentType,
    values?: Array<any>,
    constraints?: Array<FormAttrConstraintDef>,
    editable?: boolean,
    required?: boolean,
    componentSpecificProps?: {
        path?: string, // For FileChooser - where to save
    }
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
    componentName?: string,
    componentType?: ComponentType,
    transformation?: string
    isBreadcrumbKey?: boolean,
}

export type OrderByDef = {
    attr: string,
    descending?: boolean
}

export type BreadcrumbItemDef = {
    DBObject: DBObjectType,
    text: string
}

/**
 * ############
 * REDUX STATES
 * ############
 */

export type RootState = ReturnType<typeof store.getState>

export interface BreadcrumbState {
    items: Array<BreadcrumbItemDef>
}

export interface FormDefinitionsState {
    definitions: FormDefs,
    actualFormDefinition: FormDef,
    definitionsLoaded: boolean
}

export interface OtherStates {
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