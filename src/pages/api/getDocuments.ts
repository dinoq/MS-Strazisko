import { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";
import { dataConfig } from "@features/data/database-config";

// Získání školních roků z databáze - není vyžadováno přihlášení
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let docs: Array<string> = [];
    const db = new Database(dataConfig.databasePath, { verbose: console.log });

    const stmt = db.prepare("SELECT id_document, name, url FROM Document;")
    const sqlResults = stmt.all();

    for (const sqlResult of sqlResults) {
        docs.push(sqlResult);
    }

    db.close();
    res.json(docs)
}


export default handler;