import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import { DBManager } from "../../../constants/DBManager";
import { DBObjectAttr } from "../../../constants/types";


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
		const className = req.query["className"];
		const condition = req.query["condition"] || "";
		if (!className || className.includes(" ") || className.includes(";") || condition.includes(";")) { // bezpečnostní pojistka
			db.close();
			return res.status(500).send("ERROR - wrong data className or condition!");
		}
		console.log('className: ', className);
		const stmt = db.prepare("SELECT * FROM " + className + ";")
		const sqlResults = stmt.all();
		console.log('sqlResults: ', sqlResults);

		db.close();
		return res.json(sqlResults);
	} else if (req.method == "POST") {
		const className = req.body["className"];
		const attrs = req.body["attributes"];
		if (!className || className.includes(" ") || className.includes(";") || !attrs || Array.isArray(attrs) || typeof attrs != "object") { // bezpečnostní pojistka
			db.close();
			return res.status(500).send("ERROR - wrong data className or attribute!");
		}

		try {
			// check class...
			const DBObjectDefinitionAttrs: Array<DBObjectAttr> = DBManager.getDBObjectDefinition(className).attributes;
			for (const attrKey in attrs) {
				if (!DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey)) {
					return res.status(500).send("ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + className + "'");
				}
			};
            if (Object.keys(attrs).length != DBObjectDefinitionAttrs.length) { // bezpečnostní pojistka
                db.close();
                return res.status(500).send("ERROR - Wrong attribute count!");
            }
            let attrsStr = "(" + Object.keys(attrs).join(", ") + ")";
            let questionsStr = "(" + Object.keys(attrs).map(attr=> "?").join(", ") + ")";
            if (attrsStr.includes(";") || questionsStr.includes(";")) { // bezpečnostní pojistka
                db.close();
                return res.status(500).send("ERROR - error with attributes!");
            }
            console.log("s:", 'INSERT INTO ' + className + ' ' + attrsStr + ' VALUES ' + questionsStr);
			const stmt = db.prepare('INSERT INTO ' + className + ' ' + attrsStr + ' VALUES ' + questionsStr);
			const info = stmt.run(Object.values(attrs));
		} catch (error) {
			db.close();
			return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR! " + error)));
		}
		db.close();
		return res.status(200).send("Success!");
	} else if (req.method == "DELETE") {
    
        
        try {
         /* const sqlPhotos = "SELECT * FROM photos WHERE id_album=?";
          const stmtPhotos = db.prepare(sqlPhotos);
          const sqlResults = stmtPhotos.all(year);
          if(sqlResults.length){// Nemuze se smazat rok, pokud obsahuje alba
            db.close();
            return res.status(500).send("Chyba! Dané album obsahuje nějaké fotografie. Nejprve muíte smazat je a až potom samotné album!");
          }
          
          const sql = "DELETE FROM albumPasswords WHERE id_albumPasswords=?";
          const stmt = db.prepare(sql);
          stmt.run(year);*/
        } catch (error) {
          db.close();
          return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR! " + error)));
        }
        db.close();
        return res.status(200).send("Success!");
      }else {
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