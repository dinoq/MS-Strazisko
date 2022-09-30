import { getEmptyValues } from "../../database/definitions/values-definitions";
import { DetailFrameComponentType, ListFrameComponentType } from "./constants";
import {
    DFComponentDef,
    FormDef,
    FormDefs,
    LFComponentDef,
    RecursivePartial,
} from "./types";
import * as ValuesDefinitions from "../../database/definitions/values-definitions";

export class XMLParser {
    public static _defaultDefinition: RecursivePartial<FormDef> = {
        detailFrame: {
            components: [
                {
                    componentType: DetailFrameComponentType.TextField,
                    componentName: "??",
                    values: getEmptyValues(),
                    editable: true,
                    constraints: [
                        {
                            condition: "",
                            errMsgIfFail: "",
                        },
                    ],
                },
            ],
            createNewEntryText: "",
            uniqueConstraintFailed:
                "Při vkládání do databáze došlo k problému kvůli vkládání již existujícího unikátního klíče.<br/>Unikátní atributy vyžadují unikátní hodnotu!",
        },
        listFrame: {
            detailDBOClass: "",
            actions: {
                delete: true,
                edit: true,
            },
            components: [
                {
                    componentType: ListFrameComponentType.TextField,
                    componentName: "??",
                    isBreadcrumbKey: false,
                    transformation: "",
                },
            ],
            cantDeleteItemMsg:
                "Chyba! Daný záznam zřejmě obsahuje nějaká podřízená data.<br>Nejprve musíte smazat je a až potom tento záznam!",
        },
        DB: {
            orderBy: {
                descending: false,
            },
            DBOClass: "",
        },
    };
    public static parseXMLFormDefinitions = async (
        xmlStringDef: string
    ): Promise<FormDefs> => {
        let parser = new DOMParser();
        let xmlDef = parser.parseFromString(xmlStringDef, "text/xml");

        let getREQUIREDAttrFromXML = (attrName: string, XML: Element): string => {
            if (!XML.getAttribute(attrName)) {
                throw new Error(
                    `ERROR: Required attribute '${attrName}' missing in form definition!`
                );
            }
            return XML.getAttribute(attrName) ?? ""; // ?? "" is only for typescript compiler...
        };
        let getOptionalAttrFromXML = (
            attrName: string,
            XML: Element,
            defaultVal?: any
        ) => {
            if (!XML.getAttribute(attrName)) {
                return defaultVal !== undefined ? defaultVal : "";
            }
            return XML.getAttribute(attrName);
        };

        let mapToComponentType = (type: string, typeset: typeof DetailFrameComponentType | typeof ListFrameComponentType) => {
            if (type == "") {
                return typeset.TextField;
            }

            if (typeset[type] == undefined) {
                throw new Error(
                    "Uknown componentType ('" + type + "') in form definition!"
                );
                return typeset.UNKNOWN;
            }
            return typeset[type];
        };

        let defs = {};
        let forms = Array.from(xmlDef.documentElement.children);
        forms.forEach((form) => {
            let def: FormDef = XMLParser.createFullDef(
                XMLParser._defaultDefinition,
                {}
            );

            // DETAIL FRAME DEF
            let XMLDF = form.getElementsByTagName("DetailFrame")[0];
            let XMLDFComponents = Array.from(XMLDF.getElementsByTagName("Component"));
            for (const XMLcomponent of XMLDFComponents) {
                let component: DFComponentDef = {
                    attributeKey: "",
                };
                component.attributeKey = getREQUIREDAttrFromXML(
                    "attributeKey",
                    XMLcomponent
                );
                component.componentType = mapToComponentType(
                    getOptionalAttrFromXML("componentType", XMLcomponent), DetailFrameComponentType
                );
                component.componentSpecificProps = {};
                if (component.componentType == DetailFrameComponentType.FileChooser) {
                    component.componentSpecificProps.path = getREQUIREDAttrFromXML(
                        "path",
                        XMLcomponent
                    );
                }
                component.componentName = getOptionalAttrFromXML(
                    "componentName",
                    XMLcomponent
                );
                if (!(component.componentName?.length)) {
                    component.componentName = component.attributeKey;
                }
                let constraints = getOptionalAttrFromXML(
                    "constraints",
                    XMLcomponent,
                    new Array()
                );
                component.constraints = constraints.length
                    ? JSON.parse(constraints)
                    : "";

                component.editable =
                    getOptionalAttrFromXML("editable", XMLcomponent).toLowerCase() !=
                    "false";
                component.required =
                    getOptionalAttrFromXML(
                        "required",
                        XMLcomponent,
                        "true"
                    ).toLowerCase() != "false";
                let values = getOptionalAttrFromXML("values", XMLcomponent);
                if (values.length) {
                    component.values = ValuesDefinitions[values]();
                }
                
                component.wide =
                getOptionalAttrFromXML("wide", XMLcomponent, undefined).toLowerCase() ==
                "true";

                def.detailFrame.components.push(component);
            }
            def.detailFrame.createNewEntryText = getOptionalAttrFromXML(
                "createNewEntryText",
                XMLDF
            );
            def.detailFrame.uniqueConstraintFailed = getOptionalAttrFromXML(
                "uniqueConstraintFailed",
                XMLDF
            );
            def.detailFrame.afterSaveMethod = getOptionalAttrFromXML(
                "afterSaveMethod",
                XMLDF
            );

            // LIST FRAME DEF
            let XMLLF = form.getElementsByTagName("ListFrame")[0];
            let XMLLFComponents = Array.from(XMLLF.getElementsByTagName("Component"));
            for (const XMLcomponent of XMLLFComponents) {
                let component: LFComponentDef = {
                    attributeKey: "",
                };
                component.attributeKey = getREQUIREDAttrFromXML(
                    "attributeKey",
                    XMLcomponent
                );
                component.componentName = getOptionalAttrFromXML(
                    "componentName",
                    XMLcomponent
                );
                if (!(component.componentName?.length)) {
                    component.componentName = component.attributeKey;
                }

                component.componentType = mapToComponentType(
                    getOptionalAttrFromXML("componentType", XMLcomponent), ListFrameComponentType
                );
                component.isBreadcrumbKey =
                    getOptionalAttrFromXML(
                        "isBreadcrumbKey",
                        XMLcomponent
                    ).toLowerCase() == "true";
                component.transformation = getOptionalAttrFromXML(
                    "transformation",
                    XMLcomponent
                );

                def.listFrame.components.push(component);
            }

            def.listFrame.detailDBOClass = getOptionalAttrFromXML(
                "detailDBOClass",
                XMLLF
            );
            let actions = getOptionalAttrFromXML("actions", XMLLF);
            def.listFrame.actions = actions.length
                ? { ...def.listFrame.actions, ...JSON.parse(actions) }
                : def.listFrame.actions;
            def.listFrame.cantDeleteItemMsg = getOptionalAttrFromXML(
                "cantDeleteItemMsg",
                XMLLF
            );
            let orderByAttr = getOptionalAttrFromXML(
                "orderBy",
                form.getElementsByTagName("ListFrame")[0]
            );
            let orderByDESC = getOptionalAttrFromXML(
                "descending",
                form.getElementsByTagName("ListFrame")[0]
            );

            let formName = form.getAttribute("FID") ?? undefined;
            def.DB = {
                orderBy: undefined,
                DBOClass: formName
            };
            if (orderByAttr.length) {
                def.DB.orderBy = {
                    attr: orderByAttr,
                    descending: orderByDESC.toLowerCase() == "true"
                }
            }
            if (formName === undefined) {
                throw new Error("form name is undefined!");
            }
            defs[formName] = def;
        });

        return defs;
    };

    protected static _isNumBoolStr = (object) =>
        typeof object == "number" ||
        typeof object == "boolean" ||
        typeof object == "string";

    public static createFullDef = (defaultDefTree, formDefTree) => {
        for (const childKey in defaultDefTree) {
            if (XMLParser._isNumBoolStr(defaultDefTree[childKey])) {
                if (formDefTree[childKey] == undefined) {
                    formDefTree[childKey] = defaultDefTree[childKey];
                }
            } else {
                if (Array.isArray(defaultDefTree[childKey])) {
                    // Kontrola na pole musí být před kontrolou na objekt, protože typeof [] = "object"
                    if (!formDefTree[childKey]) {
                        formDefTree[childKey] = [];
                    } else {
                        formDefTree[childKey].forEach((arrayItem) => {
                            XMLParser.createFullDef(defaultDefTree[childKey][0], arrayItem);
                        });
                    }
                } else if (typeof defaultDefTree[childKey] == "object") {
                    if (!formDefTree[childKey]) {
                        formDefTree[childKey] = {};
                    }
                    XMLParser.createFullDef(
                        defaultDefTree[childKey],
                        formDefTree[childKey]
                    );
                }
            }
        }
        return formDefTree;
    };
}
