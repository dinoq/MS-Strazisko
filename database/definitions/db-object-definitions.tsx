import { DBObject, RecursivePartial } from "../../src/helpers/types";

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
    Year: {
        DBOClass: "Year",
        attributes: [
            {
                key: "id_year",
                //name: "Školní rok"
            },
            {
                key: "password_hash",
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
                key: "id_year",
                //name: "Heslo"
            },
        ],
    }, 
    PrivatePhoto: {
        DBOClass: "PrivatePhoto",
        attributes: [
            {
                key: "id_private_photo",
                //name: "ID"
            },
            {
                key: "filename",
                //name: "URL"
            },
        ],
        persistentAttributes: [
            {
                key: "id_album",
                //name: "..."
            },
            {
                key: "albums.title", 
                source: "*albums.title~id_album" // attribute 'title' from class 'albums' via constraint 'id_album' (WHERE albums.id_album = id_album)
                //name: "nameee"
            },
        ],
    }, 

    Food: {
        DBOClass: "Food",
        attributes: [
            {
                key: "id_food",
            },
            {
                key: "img_url",
            }
        ]
    },



    Teacher: {
        DBOClass: "Teacher",
        attributes: [
            {
                key: "id_teacher",
            },
            {
                key: "name",
            },
            {
                key: "job",
            },
            {
                key: "filename",
            }
        ]
    }, 


    PublicPhoto: {
        DBOClass: "PublicPhoto",
        attributes: [
            {
                key: "id_public_photo",
            },
            {
                key: "filename",
            }
        ]
    }, 


    Event: {
        DBOClass: "Event",
        attributes: [
            {
                key: "id_event",
            },
            {
                key: "img_url",
            },
            {
                key: "title",
            },
            {
                key: "date",
            },
            {
                key: "description",
            }
        ]
    }, 

    IntroText: {
        DBOClass: "IntroText",
        attributes: [
            {
                key: "id_intro_text",
            },
            {
                key: "title",
            },
            {
                key: "content",
            }
        ]
    }, 



    ContactText: {
        DBOClass: "ContactText",
        attributes: [
            {
                key: "id_contact_text",
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