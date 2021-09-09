import { NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import sharp from "sharp";
import Database from "better-sqlite3";
import fs from "fs";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

async function handler(req, res: NextApiResponse, session) {
  let filename = req?.query?.file;
  let minify = req?.query?.minify;

  const loggedForYears: Array<any> = await req.session.get("loggedForYears");
  if (!loggedForYears || !loggedForYears.length) {
    res.status(401).send("Unauthorized!");
    return;
  }

  if (!filename) {
    res.status(404).send("File not specified!");
    return;
  }

  filename = (filename.startsWith("/")) ? filename.substring(1) : filename; // ošetření počátečního lomítka
  let imageBuffer: Buffer;
  try {
    imageBuffer = fs.readFileSync("public/img/albums/" + filename);
    if (minify !== undefined) {
      imageBuffer =
        await sharp(imageBuffer)
          .resize({
            fit: sharp.fit.inside,
            width: 288,
            height: 216,
          })
          .webp({ quality: 70 });
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(404).send("Not found!");
    return;
  }

  try {
    const db = new Database('database/database.db', { verbose: console.log });
    /*const sql = "select photos.filename, albumPasswords.passwordHash from photos inner join albums on photos.id_album=albums.id_album inner join albumPasswords on albums.id_albumPasswords=albumPasswords.id_albumPasswords";
    const stmt = db.prepare(sql);
    const sqlResults: Array<any> = stmt.all();
    if (sqlResults.length == 1) {
    }*/
  } catch (error) {
    res.status(500).send("Internal Server Error! Error in database!");
    return;
  }

  res.setHeader('Content-Type', 'image/jpg');
  res.status(201).send(imageBuffer);
  /*
  tady se vubec nemá tahat heslo! To je potřeba přenést do loginforyear
  naopak se zde má kontrolovat školní rok dané fotky z databáze (pokud je v loggedForYears)
  const db = new Database('database/database.db', { verbose: console.log });
  const sql = "select photos.filename, albumPasswords.passwordHash from photos inner join albums on photos.id_album=albums.id_album inner join albumPasswords on albums.id_albumPasswords=albumPasswords.id_albumPasswords";
  const stmt = db.prepare(sql);
  const sqlResults: Array<any> = stmt.all();
  if (sqlResults.length == 1) {
    const yearPasswordHash = sqlResults[0].passwordHash;
    const loggedForYears = await req.session.get("loggedForYears");
    if (loggedForYears.includes(year)) {
      res.setHeader('Content-Type', 'image/jpg');
      let imageBuffer;
      if (req?.query?.minify == "true") {
        imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + filename)).arrayBuffer();
        imageBuffer =
          await sharp(Buffer.from(imageBuffer))
            .resize({
              fit: sharp.fit.contain,
              width: 400
            })
            .webp()
            .toBuffer();
      } else {
        imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + filename)).body;
      }

      res.send(imageBuffer);
    } else {
      res.status(401).send("Unauthorized!");
    }
  } else {
    res.status(401).send("Unauthorized!");
  }*/
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});