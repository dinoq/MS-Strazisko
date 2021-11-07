import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";
import formidable from "formidable";

const handler = async (req, res) => {
  const albumID = req.query["albumID"];
  const adminLogged: boolean = await req.session.adminLogged;
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  const db = new Database('database/database.db', { verbose: console.log });
  if (req.method == "GET") {
    let albums = [];
    const stmt = db.prepare("SELECT id_photo as id, filename FROM photos where id_album=" + albumID + ";");
    const sqlResults = stmt.all();
    
    for (const sqlResult of sqlResults) {
        albums.push(sqlResult);
    }
  
    db.close();
    res.json(albums);
  } else if (req.method == "POST") {
    
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log('filesuuuuu: ', files);
    console.log('fieldsuuuuu: ', fields);
    let keys = Object.keys(files);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      console.log('key: ', key);
      //await saveFile(files[key], fields.path);
      
    }
    return res.status(200).send("");
  });
    return res.status(200).send("Success!");
  } else if (req.method == "PATCH") {
    const year = req.body["year"]; // In format XXXX/YYYY
    const password = req.body["password"];

    try {
      const stmt = db.prepare('UPDATE albumPasswords SET passwordHash = ? WHERE id_albumPasswords = ?');
      const info = stmt.run(password, year);
    } catch (error) {
      db.close();
      return res.status(500).send("ERROR! " + (process.env.NODE_ENV === "production" ? "" : error));
    }
    db.close();
    return res.status(200).send("Success!");
  } else if (req.method == "DELETE") {
    const year = req.body["year"]; // In format XXXX/YYYY
    try {
      const sqlAlbums = "SELECT * FROM albums WHERE id_albumPasswords=?";
      const stmtAlbums = db.prepare(sqlAlbums);
      const sqlResults = stmtAlbums.all(year);
      if(sqlResults.length){// Nemuze se smazat rok, pokud obsahuje alba
        db.close();
        return res.status(500).send("Chyba! Daný rok obsahuje nějaká alba. Nejprve musíte smazat je a až potom samotný školní rok!");
      }
      
      const sql = "DELETE FROM albumPasswords WHERE id_albumPasswords=?";
      const stmt = db.prepare(sql);
      stmt.run(year);
    } catch (error) {
      db.close();
      return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR! " + error)));
    }
    db.close();
    return res.status(200).send("Success!");
  }else{
    db.close();
    return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
  }
}


export default withIronSessionApiRoute(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});