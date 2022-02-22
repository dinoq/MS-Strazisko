import { withIronSessionApiRoute } from "iron-session/next";
import Database from "better-sqlite3";


const handler = async (req, res) => {
  console.log("process.env.NODE_ENV:", process.env.NODE_ENV );
  const pageYear = req.query["year"].replace("_", "/");
  const limit = req.query["limit"];

  const loggedForYears: Array<any> = await req.session.loggedForYears;
  if (!loggedForYears || !loggedForYears.length || !loggedForYears.includes(pageYear)) {
      console.log('loggedForYears: ', loggedForYears);
    res.status(401).send("Unauthorized!");
    return;
  }

  let albums = [];
  const db = new Database('database/database.db', { verbose: console.log });
  const sqlAlbums = "SELECT id_album, name, title, date FROM Album WHERE id_year='" + pageYear + "'";
  const stmtAlbums = db.prepare(sqlAlbums);
  const sqlResultsAlbums: Array<any> = stmtAlbums.all();
  if (sqlResultsAlbums.length > 0) {
    for (const resAlbum of sqlResultsAlbums) {
      let albumPhotos = [];
      const limitQuery = (limit && limit.length)? " LIMIT " + limit : "";
      const sql = "SELECT Album.title||'/'||PrivatePhoto.filename AS URL FROM PrivatePhoto INNER JOIN Album ON PrivatePhoto.id_album=Album.id_album WHERE Album.id_album=" + resAlbum.id_album + limitQuery;
      const stmt = db.prepare(sql);
      const sqlResults: Array<any> = stmt.all();
      for (const res of sqlResults) {
        albumPhotos.push(res.URL);
      }

      while(limitQuery.length && albumPhotos.length < parseInt(limit)){
        albumPhotos.push("other/no-photo.jpg");
      }
      
      albums.push({name: resAlbum.name, title: resAlbum.title, date: resAlbum.date, photos: albumPhotos});
    }
  }

  db.close();
  res.status(200).send({
    albums
  })
}

export default withIronSessionApiRoute(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});