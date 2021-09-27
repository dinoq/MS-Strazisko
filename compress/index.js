
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const srcDir = "C:/Users/dinok/Desktop/ŠKOLKA";
const outDir = "C:/Users/dinok/Desktop/compressed/";

const getAllFiles = function (dirPath, arrayOfFiles) {
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

//const result = getAllFiles(path.join(__dirname, "../public/img/albums/all"));
const result = getAllFiles(srcDir);
let progress = 0;
const startTime = new Date();
let sqlAlbums = "";
let sqlPhotos = "";
let album_id = 0;
for (const file of result) {
    let imageBuffer = fs.readFileSync(file);
    const filename = file.substring(file.lastIndexOf("/") + 1);
    const pathWithputFilename = file.substring(0, file.length - filename.length - 1)
    const directory = pathWithputFilename.substring(pathWithputFilename.lastIndexOf("/") + 1);
    if (!sqlAlbums.includes(directory)) {
        sqlAlbums += "insert into albums (date, title, id_albumPasswords, name) values (2021-09-25, " + Math.round(Math.random() * 100) + ", \"2021_2022\", \"" + directory + "\");\n";
        album_id++;
    }
    if (!sqlPhotos.includes(filename)) {
        sqlPhotos += "insert into photos (filename, id_album) values (\"" + filename + "\", " + (album_id + 3) + ");\n";
    }
    let fname = outDir + directory + "/" + filename;

    if ((100 * result.indexOf(file)) / result.length > (progress + 10)) {
        progress += 10;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(parseInt((100 * result.indexOf(file)) / result.length) + "%, " + directory + "/" + filename);

    }
    // console.log('fname: ', fname);
    // console.log('filename: ', filename);
    // console.log('directory: ', directory);
    // console.log(parseInt((100*result.indexOf(file))/result.length) + "%, " + directory + "/" + filename);


    sharp(imageBuffer)
        .resize({
            fit: sharp.fit.inside,
            width: 1920,
            height: 1920,
        })
        .webp({ quality: 70 })
        //.jpeg({ quality: 80 })
        .toFile(fname);

        fname = outDir + directory + "/compressed/" + filename;
        imageBuffer = fs.readFileSync(file);
     sharp(imageBuffer)
            .resize({
                fit: sharp.fit.inside,
                width: 240,
                height: 240,
            })
            .webp({ quality: 70 })
            //.jpeg({ quality: 80 })
            .toFile(fname);

}

console.log("\nT:", (new Date() - startTime) / 1000);
//console.log("sql:", sqlAlbums);
//console.log("sql2\n:", sqlPhotos);