import { getEmptyValues } from "../database/definitions/values-definitions";
import { ComponentType } from "./constants";
import {
  DFComponentDef,
  FormDef,
  FormDefs,
  LFComponentDef,
  RecursivePartial,
} from "./types";
import * as ValuesDefinitions from "../database/definitions/values-definitions";

export class XMLParser {
  public static _defaultDefinition: RecursivePartial<FormDef> = {
    detailFrame: {
      components: [
        {
          componentType: ComponentType.TextField,
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

    let getREQUIREDAttrFromXML = (attrName: string, XML: Element) => {
      if (!XML.getAttribute(attrName)) {
        throw new Error(
          `ERROR: Required attribute '${attrName}' missing in form definition!`
        );
      }
      return XML.getAttribute(attrName);
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

    let mapToComponentType = (type: string) => {
      switch (type) {
        case "SelectBox":
          return ComponentType.SelectBox;

        case "TextField":
          return ComponentType.TextField;
        case "NumberField":
          return ComponentType.NumberField;
        case "DateField":
          return ComponentType.DateField;
        default:
          throw new Error(
            "Uknown componentType ('" + type + "') in form definition!"
          );
          return ComponentType.UNKNOWN;
      }
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
          getOptionalAttrFromXML("componentType", XMLcomponent)
        );
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
        let values = getOptionalAttrFromXML("values", XMLcomponent);
        if (values.length) {
          component.values = ValuesDefinitions[values]();
        }

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

      // LIST FRAME DEF
      let XMLLF = form.getElementsByTagName("ListFrame")[0];
      let XMLLFComponents = Array.from(XMLDF.getElementsByTagName("Component"));
      for (const XMLcomponent of XMLLFComponents) {
        let component: LFComponentDef = {
          attributeKey: "",
        };
        component.attributeKey = getREQUIREDAttrFromXML(
          "attributeKey",
          XMLcomponent
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
      if (orderByAttr.length) {
        def.DB.orderBy.attr = orderByAttr;
        def.DB.orderBy.descending = orderByDESC.toLowerCase() == "true";
      }

      let formName = form.getAttribute("FID");
      def.DB.DBOClass = formName;
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
