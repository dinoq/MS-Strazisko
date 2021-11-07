
import { withIronSessionApiRoute  } from "iron-session/next";
import Database from "better-sqlite3";
import fs from "fs";
import { NextApiHandler, NextApiRequest } from "next";
import { IncomingMessage } from "http";

const handler = async (req: NextApiRequest, res)=> {
	const adminLogged: boolean = await req.session.adminLogged;
	if (!adminLogged) {
		res.status(401).send("Unauthorized!");
		return;
	}

	if (!req || !req.method) {
		res.status(500).send("Server error");
		return;
	}

	const db = new Database('database/database.db', { verbose: console.log });
	if (req.method == "GET") {
		let definitions = await fs.readFileSync("public/form-definitions.xml", 'utf8');
		return res.status(200).send(definitions);
	} else {
		db.close();
		return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
	}
}


export default withIronSessionApiRoute(handler, {
	cookieName: "myapp_cookiename",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production" ? true : false
	},
	password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});