import { DBObject, RecursivePartial } from "../../constants/types";

interface DBOBjectDefs {
    [key: string]: DBObject;
}

const DBObjectDefinitions: RecursivePartial<DBOBjectDefs> = {
    albumPasswords: {
        DBObjectClass: "albumPasswords",
        attributes: [
            {
                key: "id_albumPasswords",
                name: "Školní rok"
            },
            {
                key: "passwordHash",
                name: "Heslo"
            }
        ]
    }
}

export const getRawDBObjectDefinition = (DBObjectClass: string): DBObject => {
    return (DBObjectDefinitions[DBObjectClass] as DBObject);
  }