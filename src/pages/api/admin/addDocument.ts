import Database from "better-sqlite3";
import formidable from "formidable";
import fs from "fs/promises";
import { sessionOptions } from "../../../features/auth/sessionConfig";
import { getIronSession } from "iron-session";
import { dataConfig } from "@features/data/database-config";

export const config = {
    api: {
        bodyParser: false
    }
};

const handler = async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean = await (session as any).adminLogged;
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
    const data = await fs.readFile(file.path, "utf-8");
    const fullPath = "./public" + (url.startsWith("/") ? "" : "/") + url;
    await fs.writeFile(fullPath, data);
    await fs.unlink(file.path); // remove temp file
    return;
};

const saveToDB = (name, url) => {

    const db = new Database(dataConfig.databasePath, { verbose: console.log });

    const stmt = db.prepare('INSERT INTO Document (name, url) VALUES (?, ?)');
    const info = stmt.run(name, url);
    db.close();
}

export default handler;