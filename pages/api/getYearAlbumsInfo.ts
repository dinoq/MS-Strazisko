import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";


const handler = async (req, res)=>{
    const pageYear = req.query["year"];
    console.log('pageYear: ', pageYear);

    const loggedForYears: Array<any> = await req.session.get("loggedForYears");
    if(!loggedForYears || !loggedForYears.length || !loggedForYears.includes(pageYear)){
      res.status(401).send("Unauthorized!");
      return;
    }
 
    let albums = [];
    const db = new Database('database/database.db', { verbose: console.log });
    const sql = "SELECT id_album, name, date FROM albums WHERE id_albumPasswords='2021_2022'";
    const stmt = db.prepare(sql);
    const sqlResults: Array<any> = stmt.all();
    if (sqlResults.length > 0) {
      for(const res of sqlResults){
        console.log('sqlResult: ', res);
      }
    }
    res.send({
        albums
    })
}   

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});