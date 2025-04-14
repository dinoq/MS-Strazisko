
import Database from "better-sqlite3";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../features/auth/sessionConfig";
import { dataConfig } from "@features/data/database-config";


const handler = async (req, res) => {
  const pageYear = req.query["year"].replace("_", "/");
  const limit = req.query["limit"];

  const session = await getIronSession(req, res, sessionOptions);
  const loggedForYears: Array<any> = await (session as any).loggedForYears;
  if (!loggedForYears || !loggedForYears.length || !loggedForYears.includes(pageYear)) {
    res.status(401).send("Unauthorized!");
    return;
  }

  let albums: Array<{name: string, title: string, date: string, photos: Array<string>}> = [];
  const db = new Database(dataConfig.databasePath, { verbose: console.log });
  const sqlAlbums = "SELECT id_album, name, title, date FROM Album WHERE id_year='" + pageYear + "'";
  const stmtAlbums = db.prepare(sqlAlbums);
  const sqlResultsAlbums: Array<any> = stmtAlbums.all();
  if (sqlResultsAlbums.length > 0) {
    for (const resAlbum of sqlResultsAlbums) {
      let albumPhotos: Array<string> = [];
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

export default handler;