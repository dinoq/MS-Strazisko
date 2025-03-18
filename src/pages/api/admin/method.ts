
import Database from "better-sqlite3";
import fs from "fs";
import { getIronSession } from "iron-session";
import sharp from "sharp";
import { sessionOptions } from "../../../helpers/sessionConfig";

const knownMethods = {
    createDirectoryIfNotExist: {
        paramCount: 1,
    },
    deleteDirectory: {
        paramCount: 1,
    },
    deleteFile: {
        paramCount: 1,
    },
    createThumbnail: {
        paramCount: 1,
    },
};

const handler = async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean = await (session as any).adminLogged;
    if (!adminLogged) {
        res.status(401).send("Unauthorized!");
        return;
    }

    if (!req || !req.method) {
        res.status(500).send("Server error");
        return;
    }

    const db = new Database("database/database.db", { verbose: console.log });
    if (req.method == "POST") {
        const methodName = req.body["methodName"];
        const params: Array<any> = req.body["params"];
        if (!Array.isArray(params)) {
            db.close();
            return res
                .status(500)
                .send("ERROR - params for server method '" + methodName + "' are not sended as array!");
        }

        // method check
        let success = false;
        let knownMethod = knownMethods[methodName]
        if (knownMethod && knownMethod.paramCount == params.length) {
            success = true;
        }

        if (!success) {
            db.close();
            return res
                .status(500)
                .send("ERROR - unknown server method '" + methodName + "' or bad param count!");
        }

        let path: string;
        switch (knownMethods[methodName]) {
            case knownMethods.createDirectoryIfNotExist:
                path = "./public/" + params[0];
                console.log('pathX', path);
                if (!fs.existsSync(path)) {
                    console.log('pathX, !exist:: ', path);
                    let newDirPath = fs.mkdirSync(path, { recursive: true });
                    return res
                        .status(200).send("Directory created.");
                }
                return res
                    .status(200).send("OK");
                break;
            case knownMethods.deleteDirectory:
                path = "./public/" + params[0];
                if (fs.existsSync(path)) {
                    let result = fs.rmdirSync(path, { recursive: true });
                    return res
                        .status(200).send("Directory removed.");
                } else {
                    return res
                        .status(404).send("Directory not found!");
                }
                break;
            case knownMethods.deleteFile:
                path = "./public/" + params[0];
                if (fs.existsSync(path)) {
                    let result = fs.unlinkSync(path)
                    return res
                        .status(200).send("File deleted.");
                }
                return res
                    .status(404).send("File not found!");
                break;
            case knownMethods.createThumbnail:
                const originalFilePath = "./public/" + params[0];
                let thumbnailsDirPath = originalFilePath.substring(0, originalFilePath.lastIndexOf("/")) + "/thumbnails";
                let filename = originalFilePath.substring(originalFilePath.lastIndexOf("/"));
                if (!fs.existsSync(thumbnailsDirPath)) {
                    fs.mkdirSync(thumbnailsDirPath, { recursive: true });
                }
                let fileData = await fs.readFileSync(originalFilePath);
                await (sharp(fileData)
                    .resize({
                        fit: sharp.fit.inside,
                        width: 200,
                        height: 200,
                    }).webp({ quality: 80 })
                    .toFile(thumbnailsDirPath + filename));
                return res
                    .status(200).send("Thumbnail created.");
                break;
            default:
                return res
                    .status(500)
                    .send("ERROR - Server method '" + methodName + "' not implemented!");


                break;
        }
        db.close();
        return res
            .status(200)


    } else {
        db.close();
        return res
            .status(500)
            .send("ERROR - unknown HTTP method '" + req.method + "'");
    }
};

export default handler;
