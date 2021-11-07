import { NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import sharp from "sharp";
import Database from "better-sqlite3";
import fs from "fs";

async function handler(req, res) {
  let filename: string = req?.query?.file;
  let minify = req?.query?.minify;

  const loggedForYears: Array<any> = await req.session.loggedForYears;
  const adminLogged: boolean = await req.session.adminLogged;
  if ((!loggedForYears || !loggedForYears.length) && (!adminLogged)) {
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
    let dirPath = "public/img/albums/";
    if (minify !== undefined) {
      const slashPos = filename.indexOf("/");
      const album = filename.substring(0, slashPos);
      const file = filename.substring(slashPos, filename.length);
      dirPath += album + "/thumbnails" + file;

      /*imageBuffer =
        await sharp(imageBuffer)
          .resize({
            fit: sharp.fit.inside,
            width: 1920,
            height: 1080,
          })
          .webp({ quality: 70 });*/
    } else {
      dirPath += filename;
    }
    imageBuffer = fs.readFileSync(dirPath);
  } catch (error) {
    //console.log('error: ', error);
    res.status(404).send("Not found!");
    return;
  }

  let db;
  try {
    db = new Database('database/database.db', { verbose: console.log });
    /*const sql = "select photos.filename, albumPasswords.passwordHash from photos inner join albums on photos.id_album=albums.id_album inner join albumPasswords on albums.id_albumPasswords=albumPasswords.id_albumPasswords";
    const stmt = db.prepare(sql);
    const sqlResults: Array<any> = stmt.all();
    if (sqlResults.length == 1) {
    }*/
  } catch (error) {
    res.status(500).send("Internal Server Error! Error in database!");
    return;
  } finally {
    db.close();
  }

  res.setHeader('Content-Type', 'image/jpg');
  res.status(200).send(imageBuffer);

}

export default withIronSessionApiRoute(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});