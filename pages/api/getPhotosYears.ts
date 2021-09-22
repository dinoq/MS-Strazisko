import { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";

    // Získání školních roků z databáze - není vyžadováno přihlášení
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let years = [];
    const db = new Database('database/database.db', { verbose: console.log });

    const stmt = db.prepare("SELECT date FROM albums INNER JOIN photos ON albums.id_album=photos.id_album ORDER BY date;")
    const sqlResults = stmt.all();
    
    for (const sqlResult of sqlResults) {
        let date = new Date(sqlResult.date);
        let yearStr: string = "";
        if ((date.getMonth() + 1) < 9) {
            yearStr = (date.getFullYear() - 1) + "_" + date.getFullYear();
        } else {
            yearStr = date.getFullYear() + "_" + (date.getFullYear() + 1);
        }


        if (!years.includes(yearStr)) {
            years.push(yearStr);
        }
    }


    /*
    if(sqlMinMaxDates.length === 1){
        let startSchoolYear = 0; // Počáteční školní rok (první album bude ze školního roku startSchoolYear/startSchoolYear+1)
        let endSchoolYear = 0; // Poslední školní rok (poslední album bude ze školního roku endSchoolYear/endSchoolYear+1)
        const range: string = sqlMinMaxDates[0].range;
        let min = range.split("/")[0];
        let minDate = new Date(min)
        if((minDate.getMonth() + 1) < 9){ // do září => jedná se o ěkolní rok, který začal v minulém roce
            startSchoolYear = minDate.getFullYear()-1;
        }else{ // po září => školní rok začal tímto rokem
            startSchoolYear = minDate.getFullYear();
        }

        let max = range.split("/")[1];
        let maxDate = new Date(max)
        if((maxDate.getMonth() + 1) < 9){ // do září => jedná se o ěkolní rok, který začal v minulém roce
            endSchoolYear = maxDate.getFullYear()-1;
        }else{ // po září => školní rok začal tímto rokem
            endSchoolYear = maxDate.getFullYear();
        }

        let year = startSchoolYear;
        while(year <= endSchoolYear){
            years.push(year+"_"+(year+1));
            year++;
        }

    }*/

    db.close();
    res.json(years);
}


export default handler;