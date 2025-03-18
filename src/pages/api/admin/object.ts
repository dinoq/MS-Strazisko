
import Database from "better-sqlite3";
import { isValidClassName } from "../../../helpers/utils";


const handler = async (req, res) => {
	const adminLogged: boolean = await req.session.adminLogged;
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
        
		if (!isValidClassName(className)) { // bezpečnostní pojistka
			db.close();
			return res.status(500).send("ERROR - wrong data className!");
		}

        if(!className.length){
            return res.status(500).send("ERROR - className not received!");
        }

		const stmt = db.prepare("SELECT * FROM " + className + " limit 1;")
		const sqlResults = stmt.all();
        let attributes: Array<{key: string, name: string, value: string}> = [];
        if(sqlResults.length){
            for(const columnName in sqlResults[0]){
                const stmtName = db.prepare("SELECT attrName FROM attributes WHERE attrKey = ?;")
                const sqlNameResults = stmtName.all(className + "." + columnName);
                const attrName = (sqlNameResults?.length)? sqlNameResults[0]?.attrName : "";
                attributes.push({key: columnName, name: attrName, value: ""});
            }
        }
		db.close();
        let DBObjectDef = {DBOClass: className, attributes}
		return res.json(DBObjectDef);
	} else {
		db.close();
		return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
	}
}


export default handler;