import { DBObject, RecursivePartial } from "../../src/types";

/**
 * SUBSTITUCE ATD:
 * *albums.title~id_album" 
 *  - * znamená, že pro všechny získané hodnoty bude mít stejnou hodnotu (zejm. protože se ta hodnota bere ze společného předka)
 *  - albums.title~id_album -  atribut 'title' ze třídy 'albums' přes vazbu 'id_album' (WHERE albums.id_album = id_album)
 */
interface DBOBjectDefs {
    [key: string]: DBObject;
}

const DBObjectDefinitions: RecursivePartial<DBOBjectDefs> = {
    albumPasswords: {
        DBOClass: "albumPasswords",
        attributes: [
            {
                key: "id_albumPasswords",
                //name: "Školní rok"
            },
            {
                key: "passwordHash",
                //name: "Heslo"
            }
        ]
    }, 
    albums: {
        DBOClass: "albums",
        attributes: [
            {
                key: "id_album",
                //name: "ID alba"
            },
            {
                key: "date",
                //name: "Datum"
            },
            {
                key: "title",
                //name: "URL"
            },
            {
                key: "name",
                //name: "Název"
            }
        ],
        persistentAttributes: [
            {
                key: "*id_albumPasswords",
                //name: "Heslo"
            },
        ],
    }, 
    photos: {
        DBOClass: "photos",
        attributes: [
            {
                key: "id_photo",
                //name: "ID"
            },
            {
                key: "filename",
                //name: "URL"
            },
        ],
        persistentAttributes: [
            {
                key: "*id_album",
                //name: "..."
            },
            {
                key: "*albums.title~id_album", // attribute 'title' from class 'albums' via constraint 'id_album' (WHERE albums.id_album = id_album)
                //name: "nameee"
            },
        ],
    }, 



    ContactTexts: {
        DBOClass: "ContactTexts",
        attributes: [
            {
                key: "contact_text_id",
                //name: "ID textu"
            },
            {
                key: "title",
                //name: "Typ textu"
            },
            {
                key: "content",
                //name: "Obsah"
            }
        ]
    }
}

export const getRawDBObjectDefinition = (DBOClass: string): DBObject => {
    return (DBObjectDefinitions[DBOClass] as DBObject);
  }