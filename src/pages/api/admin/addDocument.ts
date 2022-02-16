import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = async (req, res) => {
  const adminLogged: boolean = await req.session.adminLogged;
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }


  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      await saveFile(files.document, "dokumenty/" + fields.url);
      saveToDB(fields.name, fields.url);
      res.status(200).send("Saved");
    });
  } catch (error) {
    res.status(500).send("Error during document saving!");
  }
}



const saveFile = async (file, url) => {
  const data = await fs.readFileSync(file.path);
  const fullPath = "./public" + (url.startsWith("/") ? "" : "/") + url;
  await fs.writeFileSync(fullPath, data);
  await fs.unlinkSync(file.path); // remove temp file
  return;
};

const saveToDB = (name, url) => {

  const db = new Database('database/database.db', { verbose: console.log });

  const stmt = db.prepare('INSERT INTO Document (name, url) VALUES (?, ?)');
  const info = stmt.run(name, url);
  db.close();
}

export default withIronSessionApiRoute(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});