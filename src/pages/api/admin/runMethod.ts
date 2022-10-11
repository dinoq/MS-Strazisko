import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";
import fs from "fs";

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
};

const handler = async (req, res) => {
    const adminLogged: boolean = await req.session.adminLogged;
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

        let path;
        switch(knownMethods[methodName]){
            case knownMethods.createDirectoryIfNotExist:
                path = "./public/" + params[0];
                if (!fs.existsSync(path)) {
                    let newDirPath = fs.mkdirSync(path, { recursive: true });
                    return res
                        .status(200).send("Directory created.");
                }
            break;
            case knownMethods.deleteDirectory:
                path = "./public/" + params[0];
                console.log('dir: ', path);
                console.log('fs.existsSync(dir): ', fs.existsSync(path));
                if (fs.existsSync(path)) {
                    let result = fs.rmdirSync(path, { recursive: true });
                    return res
                        .status(200).send("Directory removed.");
                }
            break;
            case knownMethods.deleteFile:
                path = "./public/" + params[0];
                if (fs.existsSync(path)) {
                    let result = fs.unlinkSync(path)
                    return res
                        .status(200).send("File deleted.");
                }
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

export default withIronSessionApiRoute(handler, {
    cookieName: "myapp_cookiename",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});
