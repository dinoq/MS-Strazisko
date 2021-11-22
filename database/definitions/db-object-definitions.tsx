import { DBObject, RecursivePartial } from "../../src/types";

interface DBOBjectDefs {
    [key: string]: DBObject;
}

const DBObjectDefinitions: RecursivePartial<DBOBjectDefs> = {
    albumPasswords: {
        DBOClass: "albumPasswords",
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
        DBOClass: "albums",
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
    }, 
    photos: {
        DBOClass: "photos",
        attributes: [
            {
                key: "id_photo",
                name: "ID"
            },
            {
                key: "filename",
                name: "URL"
            },
            {
                key: "id_album",
                name: "..."
            },
            {
                key: "*albums.title|albums.id_album=id_album",
                name: "nameee"
            },
        ]
    }, 



    ContactTexts: {
        DBOClass: "ContactTexts",
        attributes: [
            {
                key: "contact_text_id",
                name: "ID textu"
            },
            {
                key: "title",
                name: "Typ textu"
            },
            {
                key: "content",
                name: "Obsah"
            }
        ]
    }
}

export const getRawDBObjectDefinition = (DBOClass: string): DBObject => {
    return (DBObjectDefinitions[DBOClass] as DBObject);
  }