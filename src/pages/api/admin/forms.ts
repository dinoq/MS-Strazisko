// pages/api/admin/forms.ts

import { sessionOptions } from "@features/auth/sessionConfig"; // Adjust the path accordingly
import { dataConfig } from "@features/data/database-config";
import Database from "better-sqlite3";
import fs from "fs";
import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

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

    const db = new Database(dataConfig.databasePath, { verbose: console.log });
    if (req.method == "GET") {
        let definitions = await fs.readFileSync(dataConfig.formDefPath, 'utf8');
        return res.status(200).send(definitions);
    } else {
        db.close();
        console.log('Unknown HTTP method: ', req.method);
        return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
    }
}

export default handler;
