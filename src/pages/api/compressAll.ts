
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
        const fname = "public/img/albums/compressed90/" + Math.random() + ".webp";
        await sharp(imageBuffer)
            .resize({
                fit: sharp.fit.inside,
                width: 1920,
                height: 1080,
            })
            .webp({ quality: 90 })
            .toFile(fname);
    }
    res.status(200).send("done!");;
}

export default handler;