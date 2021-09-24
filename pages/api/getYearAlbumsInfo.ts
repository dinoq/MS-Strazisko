import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";


const handler = async (req, res) => {
  const pageYear = req.query["year"];
  const limit = req.query["limit"];

  const loggedForYears: Array<any> = await req.session.get("loggedForYears");
  if (!loggedForYears || !loggedForYears.length || !loggedForYears.includes(pageYear)) {
    res.status(401).send("Unauthorized!");
    return;
  }

  let albums = [];
  const db = new Database('database/database.db', { verbose: console.log });
  const sqlAlbums = "SELECT id_album, name, title, date FROM albums WHERE id_albumPasswords='" + pageYear + "'";
  const stmtAlbums = db.prepare(sqlAlbums);
  const sqlResultsAlbums: Array<any> = stmtAlbums.all();
  if (sqlResultsAlbums.length > 0) {
    for (const resAlbum of sqlResultsAlbums) {
      let albumPhotos = [];
      const limitQuery = (limit && limit.length)? " LIMIT " + limit : "";
      const sql = "SELECT albums.title||'/'||photos.filename AS URL FROM photos INNER JOIN albums ON photos.id_album=albums.id_album WHERE albums.id_album=" + resAlbum.id_album + limitQuery;
      const stmt = db.prepare(sql);
      const sqlResults: Array<any> = stmt.all();
      for (const res of sqlResults) {
        albumPhotos.push(res.URL);
      }

      while(albumPhotos.length < 4){
        albumPhotos.push("other/no-photo.jpg");
      }
      
      albums.push({name: resAlbum.name, title: resAlbum.title, date: resAlbum.date, photos: albumPhotos});
    }
  }
  res.status(201).send({
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