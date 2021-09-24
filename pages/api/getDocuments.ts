import { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";

// Získání školních roků z databáze - není vyžadováno přihlášení
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let docs = [];
    const db = new Database('database/database.db', { verbose: console.log });

    const stmt = db.prepare("SELECT id_documents, name, url FROM documents;")
    const sqlResults = stmt.all();

    for (const sqlResult of sqlResults) {
        docs.push(sqlResult);
    }

    db.close();
    res.json(docs)
}


export default handler;