import { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // TODO získat roky z databáze (porovnáním nejmenšího a největšího date u fotek) - není vyžadováno přihlášení
    // Pozor je potřeba porovnat co je před a co po září, aby šlo vytvořit rok ve formátu rok_rok+1
    
    let years = [];
    const db = new Database('database/database.db', { verbose: console.log });
    
    const stmt = db.prepare("SELECT DISTINCT date FROM photos ORDER BY date")
    const sqlResults = stmt.all();
    for(const sqlResult of sqlResults){
        console.log('date: ', sqlResult.date);

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
    res.json({ years })
  }


  export default  handler;