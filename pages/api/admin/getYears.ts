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

  let years = [];
  const db = new Database('database/database.db', { verbose: console.log });

  const stmt = db.prepare("SELECT id_albumPasswords, passwordHash FROM albumPasswords ORDER BY id_albumPasswords DESC;")
  const sqlResults = stmt.all();
  
  for (const sqlResult of sqlResults) {
      let date = new Date(sqlResult.date);
      let entry: any = {};
      entry["year"] = sqlResult.id_albumPasswords;
      entry["password"] = sqlResult.passwordHash;
      
      years.push(entry);
  }

  db.close();
  res.json(years);

}


export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});