
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const srcDir = "";
const outDir = "";

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

console.log("PATHHH", path.join(__dirname, "../public/img/albums/all"));
//const result = getAllFiles(path.join(__dirname, "../public/img/albums/all"));
const result = getAllFiles("C:/Users/dinok/Desktop/ŠKOLKA");
let progress = 0;
const startTime = new Date();
for (const file of result) {
    let imageBuffer = fs.readFileSync(file);
    const filename = file.substring(file.lastIndexOf("/") + 1);
    const pathWithputFilename = file.substring(0, file.length - filename.length - 1)
    const directory = pathWithputFilename.substring(pathWithputFilename.lastIndexOf("/") + 1);
    const fname = "C:/Users/dinok/Desktop/compressed/" + directory + "/" + filename;

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


    imageBuffer = sharp(imageBuffer)
        .resize({
            fit: sharp.fit.inside,
            width: 1920,
            height: 1080,
        })
        // .webp({ quality: 70 })
        .jpeg({ quality: 70 })
        .toFile(fname);

}


console.log("\nT:", (new Date() - startTime) / 1000);