import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";

const handler = async (req, res) => {
  const year = req.query["year"];
  console.log('req.query: ', req.query);
  console.log('req.body: ', req.body);
  
  const adminLogged: boolean = await req.session.adminLogged;
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  const db = new Database('database/database.db', { verbose: console.log });
  if (req.method == "GET") {
    let albums = [];
    const stmt = db.prepare("SELECT id_album AS id, date, title, name FROM albums where id_albumPasswords='" + year + "'");
    const sqlResults = stmt.all();
    
    for (const sqlResult of sqlResults) {
        albums.push(sqlResult);
    }
  
    db.close();
    return res.json(albums);
  } else if (req.method == "POST") {
    const date = req.body["date"]; // In format YYYY-MM-DD
    const title = req.body["title"]; 
    const pwd = req.body["pwd"]; 
    const name = req.body["name"]; 
    try {
      const stmt = db.prepare('INSERT INTO albums (date, title, id_albumPasswords, name) VALUES (?, ?, ?, ?)');
      const info = stmt.run(date, title, pwd, name);
    } catch (error) {
      db.close();
      return res.status(500).send((process.env.NODE_ENV === "production" ? "Došlo k neznámé chybě!" : ("ERROR! " + error)));
    } 
    db.close();
    return res.status(200).send("Success!");
  } else if (req.method == "PATCH") {
    const id = req.body["id"]; 
    const date = req.body["date"]; // In format YYYY-MM-DD
    const title = req.body["title"]; 
    const pwd = req.body["pwd"]; 
    const name = req.body["name"]; 

    try {
      const stmt = db.prepare('UPDATE albums SET date = ?, title = ?, id_albumPasswords = ?, name = ? WHERE id_album = ?');
      const info = stmt.run(date, title, pwd, name, id);
    } catch (error) {
      db.close();
      return res.status(500).send("ERROR! " + (process.env.NODE_ENV === "production" ? "" : error));
    }
    db.close();
    return res.status(200).send("Success!");
  } else if (req.method == "DELETE") {
    const id = req.body["id"]; 

    try {
      const sqlPhotos = "SELECT * FROM photos WHERE id_album=?";
      const stmtPhotos = db.prepare(sqlPhotos);
      const sqlResults = stmtPhotos.all(year);
      if(sqlResults.length){// Nemuze se smazat rok, pokud obsahuje alba
        db.close();
        return res.status(500).send("Chyba! Dané album obsahuje nějaké fotografie. Nejprve musíte smazat je a až potom samotné album!");
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