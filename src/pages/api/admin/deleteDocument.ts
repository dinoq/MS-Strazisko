//Pravděpodobně se nepoužívá a možno smazat
import { dataConfig } from "@features/data/database-config";
import Database from "better-sqlite3";
import fs from "fs";


const handler = async (req, res) => {
  const id = req?.body?.id;
  const url = req?.body?.url;
  
  if(id == undefined){
    res.status(404).send("ID of deleted document not specified!");
    return;
  }

  const adminLogged: boolean = await req.session.adminLogged;
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  let db;
  try {
    db = new Database(dataConfig.databasePath, { verbose: console.log });
    let stmt = db.prepare("SELECT url from Document where id_document=" + id)
    const sqlResults = stmt.all();
    const url = sqlResults[0]?.url;
    if(url == undefined){
      res.status(404).send("Document doesn't exist in database!");
      return;
    }

    const sql = "DELETE FROM Document WHERE id_document=?";
    stmt = db.prepare(sql);
    stmt.run(parseInt(id));
    
    const fullPath = "./public/dokumenty" + (url.startsWith("/") ? "" : "/") + url;
    await fs.unlinkSync(fullPath); // remove file

    res.status(200).send("Success");
    return;
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send("Error during document deletion!");
    return;
  } finally {
    db.close();
  }
}

export default handler;