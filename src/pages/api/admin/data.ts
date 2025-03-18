
import Database from "better-sqlite3";
import { DBObjectType, DBObjectAttr } from "../../../helpers/types";
import { isValidClassName, checkIfNotDangerSQL } from "../../../helpers/utils";
import { getRawDBObjectDefinition } from "../../../../database/definitions/db-object-definitions";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../helpers/sessionConfig";


const handler = async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean = await (session as any).adminLogged;
    if (!adminLogged) {
        res.status(401).send("Unauthorized!");
        return;
    }

    if (!req || !req.method) {
        res.status(500).send("Server error");
        return;
    }

    const db = new Database('database/database.db', { verbose: console.log });
    if (req.method == "GET") {
        const className: string = req.query["className"];
        let condition: string = req.query["condition"] || "";
        condition = condition.length ? (" " + condition.trim()) : "";
        const order: string = req.query["order"] || "";

        if (!isValidClassName(className) || !checkIfNotDangerSQL([condition, order])) { // bezpečnostní pojistka
            db.close();
            return res.status(500).send("ERROR - wrong data className, condition or order!");
        }
        if (!className) {
            return res.status(500).send("ERROR - className not received!");
        }
        let orderBy = (order.length) ? " ORDER BY " + order.split("|")[0] + " " + order.split("|")[1] : "";
        const stmt = db.prepare("SELECT * FROM " + className + condition + orderBy + ";");
        const sqlResults = stmt.all();
        let DBObjectDefinitionPersistentAttrs: Array<DBObjectAttr> = getRawDBObjectDefinition(className).persistentAttributes ?? [];

        if (sqlResults?.length > 0) { // TODO: Tohle by nemělo být vázané na to, že už nějaký záznam existuje ne? Nebo to nevadí?
            for (const attr of DBObjectDefinitionPersistentAttrs) {
                if (attr.source) {
                    let firstDotIndex = attr.source.indexOf(".");
                    let tildaIndex = attr.source.indexOf("~");
                    if (firstDotIndex != -1 && tildaIndex != -1) {
                        let foreignClassName;
                        if (attr.source.startsWith("*")) { // Daný atribut je pro všechny položky dané třídy stejný
                            foreignClassName = attr.source.substring(1, firstDotIndex);
                            let foreignAttrName = attr.source.substring(firstDotIndex + 1, tildaIndex);
                            let foreignConditionAttrName = attr.source.substring(tildaIndex + 1);
                            let sql = `SELECT ${foreignAttrName} FROM ${foreignClassName} WHERE ${foreignConditionAttrName}=${sqlResults[0][foreignConditionAttrName]};`;
                            const stmtBindedAttrs = db.prepare(sql);
                            const sqlResultsBindedAttrs = stmtBindedAttrs.all();
                            if (sqlResultsBindedAttrs?.length > 0) {
                                for (const sqlResult of sqlResults) {
                                    sqlResult[`${foreignClassName}.${foreignAttrName}`] = sqlResultsBindedAttrs[0][foreignAttrName];
                                }
                            }
                        } else { // Daný atribut může pro každou položku nabývat jiné hodnoty
                            foreignClassName = attr.source.substring(0, firstDotIndex);
                            return res.status(500).send("ERROR - not implemented binding without *! TODO!");
                        }
                    }
                }
                // if (!DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey)) {
                // 	return res.status(500).send("ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + className + "'");
                // }
            };
        }
        db.close();
        //console.log('sqlResults11: ', sqlResults);
        return res.json(sqlResults);
    } else if (req.method == "POST") {
        const className = req.body["className"];
        const attrs = req.body["attributes"];
        
        if (!isValidClassName(className) || !attrs || Array.isArray(attrs) || typeof attrs != "object") { // bezpečnostní pojistka
            db.close();
            return res.status(500).send("ERROR - wrong data className or attribute!");
        }
        if (!className) {
            return res.status(500).send("ERROR - className not received!");
        }

        try {
            // check class...TODO - nepoužívat DB manager, ten je jen pro klienta!!!
            /*let checkClass = DBManager.checkClassAttrs(attrs, className, true);
            if (!checkClass.success) {
                db.close();
                return res.status(500).send(checkClass.errorMsg);
            }*/

            let attrsStr = "(" + Object.keys(attrs).join(", ") + ")";
            let questionsStr = "(" + Object.keys(attrs).map(attr => "?").join(", ") + ")";
            if (attrsStr.includes(";") || questionsStr.includes(";")) { // bezpečnostní pojistka
                db.close();
                return res.status(500).send("ERROR - error with attributes!");
            }
            const sql = 'INSERT INTO ' + className + ' ' + attrsStr + ' VALUES ' + questionsStr;
            const stmt = db.prepare(sql);
            const info = stmt.run([...Object.values(attrs)]);
        } catch (error) {
            db.close();
            console.log("ERROR 2! " + error);
            return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR 2! " + error)));
        }
        db.close();
        return res.status(200).send("Success!");
    } else if (req.method == "PATCH") {
        const className = req.body["className"];
        const attrs = req.body["attributes"];
        const updateId = req.body["updateId"];
        const primaryKey: string = req.body["primaryKey"];

        if (!isValidClassName([className, updateId, primaryKey]) || !attrs || Array.isArray(attrs) || typeof attrs != "object") { // bezpečnostní pojistka
            console.log('attrs: ', attrs);
            console.log('className, updateId, primaryKey: ', className, updateId, primaryKey);
            db.close();
            return res.status(500).send("ERROR - wrong data className, updateId, primaryKey or attrs!");
        }
        if (!className || !updateId || !primaryKey) {
            db.close();
            return res.status(500).send("ERROR - className, primary key or updateId not received!");
        }
        try {
            let attrsStr = Object.keys(attrs).slice(1).join(" = ?, ") + " = ?";
            if (attrsStr.includes(";")) { // bezpečnostní pojistka
                db.close();
                return res.status(500).send("ERROR - error with attributes!");
            }
            const stmt = db.prepare('UPDATE ' + className + ' SET ' + attrsStr + ' WHERE ' + primaryKey + ' = ?');
            const info = stmt.run([...Object.values(attrs).slice(1), updateId]);
        } catch (error) {
            db.close();
            return res.status(500).send("ERROR 3! " + (process.env.NODE_ENV === "production" ? "" : error));
        }
        db.close();
        return res.status(200).send("Success!");
    } else if (req.method == "DELETE") {
        const className: string = req.body["className"];
        const detailClass: string = req.body["detailClass"];
        const primaryKey: string = req.body["primaryKey"];
        const deleteId: string = req.body["deleteId"].toString();
        const forceDelete: boolean = req.body["forceDelete"];
        const forceDeleteItemMsg: string = req.body["forceDeleteItemMsg"];
        if (!isValidClassName([className, detailClass, primaryKey, deleteId])) { // bezpečnostní pojistka
            return res.status(500).send("ERROR - wrong data className, detailClass, primaryKey or deleteId!");
        }
        if (!className || !primaryKey || !deleteId) {
            console.log('className, primaryKey, deleteId: ', className, primaryKey, deleteId);
            return res.status(500).send("ERROR - className, primary key or deleteID not received!");
        }

        try {
            if(detailClass){
                if (!forceDelete) { // Pokud neni forceDelete
                    const stmtChildren = db.prepare("SELECT * FROM " + detailClass + " WHERE " + primaryKey + "=?");
                    const sqlChildrenResults = stmtChildren.all(deleteId);
                    if (sqlChildrenResults.length) {// Nemuze se smazat zatnam, pokud obsahuje nejaka podrizena data (v podrizene tabulce)
                        db.close();
                        let msg = (typeof forceDeleteItemMsg == "string" && forceDeleteItemMsg.length) ? forceDeleteItemMsg : "Chyba! Daný záznam zřejmě obsahuje nějaká podřízená data.<br>Nejprve musíte smazat je a až potom tento záznam!";
                        return res.status(500).send(msg);
                    }
                }else{
                    const stmtChildren = db.prepare("SELECT * FROM " + detailClass + " WHERE " + primaryKey + "=?");
                    const sqlChildrenResults = stmtChildren.all(deleteId);

                }

            }

            const stmt = db.prepare("DELETE FROM " + className + " WHERE " + primaryKey + "=?");
            stmt.run(deleteId);
        } catch (error) {
            db.close();
            console.log("ERROR 1! " + error);
            return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR 1! " + error)));
        }
        db.close();
        return res.status(200).send("Success!");
    } else {
        db.close();
        return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
    }
}


export default handler;