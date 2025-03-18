
import Database from "better-sqlite3";
import { isValidClassName, checkIfNotDangerSQL } from "../../helpers/utils";

const fakeTables = ["events", "teachers", "public_images", "contact_texts", "food", "intro"];
const realTables = ["Event", "Teacher", "PublicPhoto", "ContactText", "Food", "IntroText"];

const mapTables = (table: string, toReal: boolean)=>{
    if(toReal){
        return realTables[fakeTables.indexOf(table)];
    }else{
        return fakeTables[realTables.indexOf(table)];
    }
}

const mapConditionsAndOrder = (table) =>{
    if(table == "Event"){
        return " WHERE date>=date('now') ORDER BY date;";
    }
    return "";
}
async function handler(req, res) {
    let tablesString: string = req?.query?.table;

    if (!tablesString) {
        res.status(404).send("Table not specified!");
        return;
    }


    let data = {};
    let db;
    try {
        db = new Database('database/database.db', { verbose: console.log });

        if (req.method == "GET") {
            let tables = tablesString.split(";");

            for(const tbl of tables){
                const table =  mapTables(tbl, true);
                
                if (!isValidClassName(table) || !checkIfNotDangerSQL(table)) { // bezpečnostní pojistka
                    db.close();
                    return res.status(500).send("ERROR - wrong data className, condition or order!");
                }

                const sql=`SELECT * FROM ${table}${mapConditionsAndOrder(table)}`;

                const stmt = db.prepare(sql);
                const sqlResults = stmt.all();
                data[tbl] = sqlResults;
            }
            
            db.close();
            res.status(200).send(data);
        }
        else {
            db.close();
            return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
        }

    } catch (error) {
        res.status(500).send("Internal Server Error! Error in database!");
        return;
    } finally {
        db.close();
    }


}

export default handler;