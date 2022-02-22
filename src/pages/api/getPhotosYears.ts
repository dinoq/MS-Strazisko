import { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";

// TODO - zde se získávají data jednotlivých fotek a později se z nich složitě skládají školní roky. Nebylo by lepší se prostě dotázat na záznamy albumPasswords?
// Získání školních roků z databáze - není vyžadováno přihlášení
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let years = [];
    const db = new Database('database/database.db', { verbose: console.log });

    const stmt = db.prepare("SELECT date FROM Album INNER JOIN PrivatePhoto ON Album.id_album=PrivatePhoto.id_album ORDER BY date;")
    const sqlResults = stmt.all();
    
    for (const sqlResult of sqlResults) {
        let date = new Date(sqlResult.date);
        let yearStr: string = "";
        if ((date.getMonth() + 1) < 9) {
            yearStr = (date.getFullYear() - 1) + "/" + date.getFullYear();
        } else {
            yearStr = date.getFullYear() + "/" + (date.getFullYear() + 1);
        }


        if (!years.includes(yearStr)) {
            years.push(yearStr);
        }
    }

    db.close();
    res.json(years);
}


export default handler;