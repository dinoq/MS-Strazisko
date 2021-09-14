const express = require("express");
const config = require("./config.js");
const Database = require("better-sqlite3");
const fs = require("fs");
const app = express();
const port = config.port;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/pages", (req, res) => {
  console.log('config.dbPath: ', config.dbPath);
    const db = new Database(config.dbPath, {
      verbose: console.log,
    });
    const stmt = db.prepare(
      "SELECT date FROM albums INNER JOIN photos ON albums.id_album=photos.id_album ORDER BY date;"
    );
    const sqlResults = stmt.all();
        let a = "";
    for (const sqlResult of sqlResults) {
        a+= JSON.stringify(sqlResult);
    }
    db.close();
    console.log("Hello World!",a);
  res.send(a);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  try {
    //const data = fs.readFileSync('../database/database.db', 'utf8')
  } catch (err) {
    console.error(err);
  }
});
