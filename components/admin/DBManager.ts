import { DBObject } from "../../constants/types";

export class DBManager{

    public static getEmptyDBObject = (DBObjectClass: string): DBObject => {
        //let attrs = getFormDefinition(DBObjectClass).attributes;
        let object: DBObject = { id: -1, attributes: [], isEdited: false, editedAttrs: [], DBObjectClass };
        /*attrs.forEach(attr => {
          object.attrs[attr.attributeKey] = "";
        });*/
        return object;
      }
}