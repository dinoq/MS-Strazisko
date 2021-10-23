import { FormDefinitions } from "../../constants/form-definitions";
import { DBObject } from "../../constants/types";

export class DBManager{

    public static getEmptyDBObject = (DBObjectClass: string): DBObject => {
        //let attrs = FormDefinitions[DBObjectClass].attributes;
        let object: DBObject = { id: -1, attributes: [], isEdited: false, editedAttrs: [], DBObjectClass };
        /*attrs.forEach(attr => {
          object.attrs[attr.attributeKey] = "";
        });*/
        console.log('object: ', object);
        return object;
      }
}