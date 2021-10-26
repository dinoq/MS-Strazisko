import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import { checkIfLettersSlashUnderscore } from "../../../src/utils";


const handler = async (req, res) => {
	const adminLogged: Array<any> = await req.session.get("adminLogged");
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
        
		if (!checkIfLettersSlashUnderscore(className)) { // bezpečnostní pojistka
			db.close();
			return res.status(500).send("ERROR - wrong data className!");
		}

        if(!className.length){
            return res.status(500).send("ERROR - className not received!");
        }

		const stmt = db.prepare("SELECT * FROM " + className + " limit 1;")
		const sqlResults = stmt.all();
        let attributes = [];
        if(sqlResults.length){
            for(const columnName in sqlResults[0]){
                const stmtName = db.prepare("SELECT attrName FROM attributes WHERE attrKey = ?;")
                const sqlNameResults = stmtName.all(className + "." + columnName);
                const attrName = (sqlNameResults?.length)? sqlNameResults[0]?.attrName : "";
                attributes.push({key: columnName, name: attrName, value: ""});
            }
        }
		db.close();
        let DBObjectDef = {DBObjectClass: className, attributes}
		return res.json(DBObjectDef);
	} else {
		db.close();
		return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
	}
}


export default withIronSession(handler, {
	cookieName: "myapp_cookiename",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production" ? true : false
	},
	password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});