import { DBObject, RecursivePartial } from "../../src/types";

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
    }, 
    albums: {
        DBObjectClass: "albums",
        attributes: [
            {
                key: "id_album",
                name: "ID alba"
            },
            {
                key: "date",
                name: "Datum"
            },
            {
                key: "title",
                name: "URL"
            },
            {
                key: "id_albumPasswords",
                name: "Heslo"
            },
            {
                key: "name",
                name: "Název"
            }
        ]
    }
}

export const getRawDBObjectDefinition = (DBObjectClass: string): DBObject => {
    return (DBObjectDefinitions[DBObjectClass] as DBObject);
  }