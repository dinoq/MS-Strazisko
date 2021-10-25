import { ComponentType } from "./constants"

export type DBObject = {
	id: number,	
	DBObjectClass: string,
	attributes: Array<DBObjectAttr>,
	isEdited: boolean,
	editedAttrs: Array<DBObjectAttr>
}

export type DBObjectAttr = {
	key: string,
	name: string,
	value: any
}

export type FormDef = {
	hasBreadcrumb?: boolean,
	detailFrame: DetailFrameDef,
	listFrame: ListFrameDef,
	//DBOClass: string,???? - bude bez toho vedet co "tahat"??
}

export type DetailFrameDef = {
	components: Array<DFComponentDef>,
	createNewEntryText?: string //
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
	errorIfFail: string
}

export type ListFrameDef = {
	components: Array<LFComponentDef>,
	detailDBOClass?: string,
	actions?: {
		delete: boolean,
		edit: boolean
	},
}

export type LFComponentDef = {
	attributeKey: string,
	attributeName: any,
	isBreadcrumbKey?: boolean,
}


export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] | RecursivePartial<T[P]>;
  };