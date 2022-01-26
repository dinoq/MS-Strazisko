import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";
import fs from "fs";

const knownMethods = {
  createDirectoryIfNotExist: {
    name: "createDirectoryIfNotExist",
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
    if(!Array.isArray(params)){
        db.close();
        return res
          .status(500)
          .send("ERROR - params for server method '" + methodName + "' are not sended as array!");
    }

    // method check
    let success = false;
    for(const mName in knownMethods){
        let knownMethod = knownMethods[mName];
        if(knownMethod.name == methodName && knownMethod.paramCount == params.length){
            success = true;
        }
    }

    if (!success) {
      db.close();
      return res
        .status(500)
        .send("ERROR - unknown server method '" + methodName + "' or bad param count!");
    }

    if (methodName == knownMethods.createDirectoryIfNotExist.name) {
      let dir = "./public/" + params[0];
      if (!fs.existsSync(dir)) {
        let newDirPath = fs.mkdirSync(dir, { recursive: true });
        return res
          .status(200).send("Directory created");
      }
    }

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
