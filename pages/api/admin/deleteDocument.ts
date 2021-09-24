import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import fs from "fs";


const handler = async (req, res) => {
  const id = req?.body?.id;
  const url = req?.body?.url;
  
  if(id == undefined){
    res.status(404).send("ID of deleted document not specified!");
    return;
  }

  const adminLogged: Array<any> = await req.session.get("adminLogged");
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  try {
    const db = new Database('database/database.db', { verbose: console.log });
    let stmt = db.prepare("SELECT url from documents where id_documents=" + id)
    const sqlResults = stmt.all();
    const url = sqlResults[0]?.url;
    if(url == undefined){
      res.status(404).send("Document doesn't exist in database!");
      return;
    }

    const sql = "DELETE FROM documents WHERE id_documents=?";
    stmt = db.prepare(sql);
    stmt.run(parseInt(id));
    
    const fullPath = "./public/dokumenty" + (url.startsWith("/") ? "" : "/") + url;
    await fs.unlinkSync(fullPath); // remove file

    res.status(201).send("Success");
    return;
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send("Error during document deletion!");
    return;
  }
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});