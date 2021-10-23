import { ComponentType } from "./constants"

export type DBObject = {
	id: number,	
	DBObjectClass: string,
	attributes: Array<any>,
	isEdited: boolean,
	editedAttrs: Array<any>
}

export type FormDef = {
	hasBreadcrumb: boolean | false,
	detailFrame: DetailFrameDef | false,
	listFrame: ListFrameDef | false,
	//DBOClass: string,???? - bude bez toho vedet co "tahat"??
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

export type DetailFrameDef = {
	components: Array<DFComponentDef>
}

export type DFComponentDef = {
	attributeKey: string,
	componentType?: ComponentType,
	inputType?: string,
	values?: Array<any> | string,
	constraints?: Array<FormAttrConstraintDef>
}


export type FormAttrConstraintDef = {
	condition: string,
	errorIfFail: string
}

