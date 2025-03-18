// pages/api/admin/forms.ts

import { sessionOptions } from "../../../helpers/sessionConfig"; // Adjust the path accordingly
import Database from "better-sqlite3";
import fs from "fs";
import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://ms-strazisko.cz');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean | undefined = (session as any).adminLogged;
    if (!adminLogged) {
        console.log('Unauthorized access attempt, adminLogged: ', adminLogged);
        res.status(401).send("Unauthorized!");
        return;
    }

    if (!req || !req.method) {
        console.log('Server error, invalid request');
        res.status(500).send("Server error");
        return;
    }

    const db = new Database('database/database.db', { verbose: console.log });
    if (req.method == "GET") {
        let definitions = await fs.readFileSync("./database/definitions/form-definitions.xml", 'utf8');
        return res.status(200).send(definitions);
    } else {
        db.close();
        console.log('Unknown HTTP method: ', req.method);
        return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
    }
}

export default handler;
