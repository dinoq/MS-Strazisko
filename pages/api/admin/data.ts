import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";


const handler = async (req, res) => {
  const adminLogged: Array<any> = await req.session.get("adminLogged");
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
    const className = req.query["className"];
    if(!className || className.includes(" ") || className.includes(";")){ // bezpečnostní pojistka
      db.close();
      return res.status(500).send("ERROR - wrong data className!");
    }
    console.log('className: ', className);
    const stmt = db.prepare("SELECT * FROM " + className + ";")
    const sqlResults = stmt.all();
    console.log('sqlResults: ', sqlResults);

    db.close();
    return res.json(sqlResults);
  }else{
    db.close();
    return res.status(500).send("ERROR - unknown HTTP method '" + req.method + "'");
  }
}


export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});