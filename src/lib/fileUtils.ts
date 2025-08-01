import { constants } from 'fs';
import fs from 'fs/promises';

export async function fileExists(path) {
    try {
        await fs.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function getAllFiles (dirPath, arrayOfFiles?) {
    let files = await fs.readdir(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(async function (file) {
        if ((await fs.stat(dirPath + "/" + file)).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            //arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
            arrayOfFiles.push(dirPath + "/" + file)
        }
    })

    return arrayOfFiles
}
