import { NextApiResponse } from "next";

import sharp from "sharp";
import Database from "better-sqlite3";
import fs from "fs";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../helpers/sessionConfig";

async function handler(req, res) {
    let filename: string = req?.query?.file;
    let minify = req?.query?.minify;

    const session = await getIronSession(req, res, sessionOptions);
    const loggedForYears: Array<any> = (session as any).loggedForYears;
    const adminLogged: boolean = await (session as any).adminLogged;
    if ((!loggedForYears || !loggedForYears.length) && (!adminLogged)) {
        res.status(401).send("Unauthorized!");
        return;
    }

    if (!filename) {
        res.status(404).send("File not specified!");
        return;
    }

    filename = (filename.startsWith("/")) ? filename.substring(1) : filename; // ošetření počátečního lomítka
    console.log('filename: ', filename);
    let imageBuffer: Buffer;
    try {
        let dirPath = "public/img/albums/";
        if (minify !== undefined) {
            const slashPos = filename.indexOf("/");
            const album = filename.substring(0, slashPos);
            const file = filename.substring(slashPos, filename.length);
            const dirPathThumb = dirPath + album + "/thumbnails" + file;
            if (fs.existsSync(dirPathThumb)) {
                dirPath = dirPathThumb;
                console.log('dirPath1 (thumb): ', dirPath);
            } else {
                dirPath = dirPath + album + file;
                console.log('dirPath2 (not thumb): ', dirPath);
            }

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
        /*const sql = "select photos.filename, albumPasswords.password_hash from photos inner join Album on photos.id_album=Album.id_album inner join Year on Album.id_year=albumPasswords.id_year";
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

export default handler;