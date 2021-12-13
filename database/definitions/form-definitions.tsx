import { ComponentType } from "../../src/constants";
import { DBManager } from "../../src/DBManager";
import { FormDef } from "../../src/types";
import { getYears } from "./values-definitions";

interface FormDefs {
    [key: string]: FormDef;
}


/**
 * SUBSTITUTION:
 * $ - value of attribute
 * @[attributeKey] - value of attribute of attributeKey
 */

/*
const FormDefinitions: FormDefs = {
    albumPasswords: {
        detailFrame: {
            components: [
                {
                    attributeKey: "id_albumPasswords",
                    componentType: ComponentType.SelectBox,
                    values: getYears(),
                    editable: false
                },
                {
                    attributeKey: "passwordHash",
                    constraints: [{ condition: "$.length >= 6", errMsgIfFail: "Heslo musí obsahovat alespoň 6 znaků!" }]
                }
            ],
            createNewEntryText: "Přidat školní rok",
            uniqueConstraintFailed: "Při vkládání do databáze došlo k problému kvůli vkládání již existujícího unikátního klíče.<br/>Zřejmě se pokoušíte vložit školní rok, který již v databázi existuje!"
        },
        listFrame: {
            detailDBOClass: "albums",
            components: [
                {
                    attributeKey: "id_albumPasswords",
                    isBreadcrumbKey: true,
                },
                {
                    attributeKey: "passwordHash",
                }
            ],
            cantDeleteItemMsg: "Dané album obsahuje nějaké fotografie.<br>Nejprve musíte smazat je a až potom samotné album!"
        },
        DB: {
            orderBy: {
                attr: "id_albumPasswords",
                descending: true
            },
            DBOClass: "albumPasswords"
        }
    },
    albums: {
        detailFrame: {
            components: [
                {
                    attributeKey: "id_album",
                    componentType: ComponentType.TextField,
                    editable: false
                },
                {
                    attributeKey: "date",
                    componentType: ComponentType.DateField,
                },
                {
                    attributeKey: "name",
                },
                {
                    attributeKey: "title",
                }
            ],
            createNewEntryText: "Přidat školní rok",
        },
        listFrame: {
            detailDBOClass: "photos",
            components: [
                {
                    attributeKey: "id_album",
                },
                {
                    attributeKey: "date",
                    transformation: "const date = new Date('$');date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear()"
                },
                {
                    attributeKey: "name",
                    isBreadcrumbKey: true
                },
                {
                    attributeKey: "title",
                }
            ],
            cantDeleteItemMsg: "Dané album obsahuje nějaké fotografie.<br>Nejprve musíte smazat je a až potom samotné album!"
        },
        DB: {
            orderBy: {
                attr: "id_album",
                descending: true
            },
            DBOClass: "albums"
        }
    },
    photos: {
        detailFrame: {
            components: [
                {
                    attributeKey: "id_photo",
                    componentType: ComponentType.TextField,
                    //inputType: "number",
                    editable: false
                },
                {
                    attributeKey: "filename",
                },
                {
                    attributeKey: "id_album",
                }
            ],
            createNewEntryText: "Přidat školní rok",
        },
        listFrame: {
            components: [
                {
                    attributeKey: "id_photo",
                },
                {
                    attributeKey: "filename",
                    transformation: "@[albums.title]"
                },
                {
                    attributeKey: "id_album",
                }
            ],
            cantDeleteItemMsg: "Dané album obsahuje nějaké fotografie.<br>Nejprve musíte smazat je a až potom samotné album!"
        },
        DB: {
            orderBy: {
                attr: "id_photo",
                descending: true
            },
            DBOClass: "photos"
        }
    },





    ContactTexts: {
        detailFrame: {
            components: [
                {
                    attributeKey: "contact_text_id",
                    componentType: ComponentType.TextField,
                    //inputType: "number",
                    editable: false
                },
                {
                    attributeKey: "title",
                    editable: false
                },
                {
                    attributeKey: "content"
                }
            ],

        },
        listFrame: {
            components: [
                {
                    attributeKey: "contact_text_id",
                },
                {
                    attributeKey: "title",
                },
                {
                    attributeKey: "content",
                }
            ],
            actions:{
                //delete: false
            }
        },
        DB: {
            orderBy: {
                attr: "contact_text_id"
            },
            DBOClass: "ContactTexts"
        }
    },
};


export const getRawFormDefinition = (DBOClass: string): FormDef => {
    return FormDefinitions[DBOClass];
}*/

/**
 *
 */