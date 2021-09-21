
import sharp from "sharp";
import fs from "fs";
const path = require("path");


const getAllFiles = function (dirPath, arrayOfFiles?) {
    let files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            //arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
            arrayOfFiles.push(dirPath + "/" + file)
        }
    })

    return arrayOfFiles
}

async function handler(req, res) {

    const result = getAllFiles("public/img/albums/all");
    for (const file of result) {

        let imageBuffer = fs.readFileSync(file);
        console.log('file: ', file);
        const fname ="public/img/albums/compressed90/"+Math.random()+".webp";
        console.log('fname: ', fname);
        imageBuffer =
            await sharp(imageBuffer)
                .resize({
                    fit: sharp.fit.inside,
                    width: 1920,
                    height: 1080,
                })
                .webp({ quality: 90 })
                .toFile(fname);
    }
    //console.log('result: ', result);
    res.status(200).send("done!");;
    /*
      try {
        imageBuffer = fs.readFileSync("public/img/albums/all" + filename);
        if (minify !== undefined) {
          imageBuffer =
            await sharp(imageBuffer)
              .resize({
                fit: sharp.fit.inside,
                width: 1920,
                height: 1080,
              })
              .webp({ quality: 70 });
        }
      } catch (error) {
        console.log('error: ', error);
        res.status(404).send("Not found!");
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

export default handler;