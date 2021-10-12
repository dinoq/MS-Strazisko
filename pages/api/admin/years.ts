import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import formidable from "formidable";
import fs from "fs";


const handler = async (req, res) => {
  const adminLogged: Array<any> = await req.session.get("adminLogged");
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  if (!req || !req.method) {
    res.status(500).send("Server error");
    return;
  }

  const db = new Database('database/database.db', { verbose: console.log });
  if (req.method == "GET") {
    let years = [];
    const stmt = db.prepare("SELECT id_albumPasswords, passwordHash FROM albumPasswords ORDER BY id_albumPasswords DESC;")
    const sqlResults = stmt.all();

    for (const sqlResult of sqlResults) {
      let entry: any = {};
      entry["year"] = sqlResult.id_albumPasswords.replace("_", "/");
      entry["password"] = sqlResult.passwordHash;

      years.push(entry);
    }

    db.close();
    return res.json(years);
  } else if (req.method == "POST") {
    const year = req.body["year"]; // In format XXXX/YYYY
    const pwd = req.body["pwd"];
    try {
      const stmt = db.prepare('INSERT INTO albumPasswords (id_albumPasswords, passwordHash) VALUES (?, ?)');
      const info = stmt.run(year.replace('/', '_'), pwd);
    } catch (error) {
      db.close();
      return res.status(500).send("ERROR! " + (process.env.NODE_ENV === "production" ? "" : error));
    } 
    db.close();
    return res.status(200).send("Success!");
  } else if (req.method == "PATCH") {
    const year = req.body["year"]; // In format XXXX/YYYY
    const pwd = req.body["pwd"];
    console.log('pwd: ', pwd);
    console.log('year: ', year);

    try {
      const stmt = db.prepare('UPDATE albumPasswords SET passwordHash = ? WHERE id_albumPasswords = ?');
      const info = stmt.run(pwd, year.replace('/', '_'));
    } catch (error) {
      db.close();
      return res.status(500).send("ERROR! " + (process.env.NODE_ENV === "production" ? "" : error));
    }
    db.close();
    return res.status(200).send("Success!");
  } else if (req.method == "DELETE") {
    const year = req.body["year"]; // In format XXXX/YYYY
    console.log('year: ', year);

    try {
      const sql = "DELETE FROM albumPasswords WHERE id_albumPasswords=?";
      const stmt = db.prepare(sql);
      stmt.run(year.replace('/', '_'));
    } catch (error) {
      db.close();
      return res.status(500).send("ERROR! " + (process.env.NODE_ENV === "production" ? "" : error));
    }
    db.close();
    return res.status(200).send("Success!");
  }else{
    db.close();
    return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
  }
}


export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});