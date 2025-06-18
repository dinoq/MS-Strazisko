import { DetailFrameComponentType, ListFrameComponentType } from "./constants"
import store from "../store"

/**
 * ########
 * DBObject
 * ########
 */
export interface DBObjectType {
    id: number,
    DBOClass: DBOClassType,
    attributes: Array<DBObjectAttr>,
    persistentAttributes: Array<DBObjectAttr>,
    editedAttrs: Array<DBObjectAttr>,
    isEdited: boolean
}

export interface DBObjectAttr {
    key: string,
    value: any,
    source?: string
}

/**
 * ###############
 * FORM DEFINITION
 * ###############
 */
export interface FormDef {
    detailFrame: DetailFrameDef,
    listFrame: ListFrameDef,
    DB?: {
        orderBy?: OrderByDef,
        DBOClass: DBOClassType,
    }
    //DBOClass: DBOClassType,???? - bude bez toho vedet co "tahat"??
}

export interface FormDefs {
    [key: string]: FormDef;
}

export type DBOClassType = string | undefined;

export interface DetailFrameDef {
    components: Array<DFComponentDef>,
    createNewEntryText?: string,
    uniqueConstraintFailed?: string,
    afterSaveMethod?: string,
}

export interface DFComponentDef {
    attributeKey: string,
    componentName?: string,
    componentType?: DetailFrameComponentType,
    values?: Array<any>,
    constraints?: Array<FormAttrConstraintDef>,
    editable?: boolean,
    required?: boolean,
    componentSpecificProps?: {
        path?: string, // For FileChooser - where to save
    }
    wide?: boolean
}

export interface FormAttrConstraintDef {
    condition: string,
    errMsgIfFail: string
}

export interface ListFrameDef {
    components: Array<LFComponentDef>,
    detailDBOClass?: string,
    actions?: ListFrameActionsDef,
    forceDeleteItemMsg?: string,
    afterDeleteMethod?: string,
}

export interface ListFrameActionsDef {
    delete?: boolean,
    edit?: boolean
}
export interface LFComponentDef {
    attributeKey: string,
    componentName?: string,
    componentType: ListFrameComponentType,
    transformation?: string
    isBreadcrumbKey?: boolean,
}

export interface OrderByDef {
    attr: string,
    descending?: boolean
}

export interface BreadcrumbItemDef {
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
    actualFormDefinition: string, // (FID)
    definitionsLoaded: boolean
}

/**
 * #########
 * UTILITIES
 * #########
 */
export type RecursivePartial<T> = {
    [K in keyof T]?: T[K] | RecursivePartial<T[K]>;
};

declare module "iron-session" {
    interface IronSessionData {
        adminLogged?: boolean;
        loggedForYears?: Array<string>
    }
}