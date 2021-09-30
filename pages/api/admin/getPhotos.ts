import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import formidable from "formidable";
import fs from "fs";

const handler = async (req, res) => {
  const albumID = req.query["albumID"];
  const adminLogged: Array<any> = await req.session.get("adminLogged");
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  let albums = [];
  const db = new Database('database/database.db', { verbose: console.log });  
  const stmt = db.prepare("SELECT id_photo as id, filename FROM photos where id_album=" + albumID + ";");
  const sqlResults = stmt.all();
  
  for (const sqlResult of sqlResults) {
      albums.push(sqlResult);
  }

  db.close();
  res.json(albums);
}


export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});