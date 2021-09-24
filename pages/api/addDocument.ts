import { withIronSession } from "next-iron-session";
import Database from "better-sqlite3";
import formidable from "formidable";
/*
export default async (req, res) => {
  const fileName = req.query["name"];
  console.log('fileName: ', fileName);
  const fileURL = req.query["url"];
  console.log('fileURL: ', fileURL);

  const adminLogged: Array<any> = await req.session.get("adminLogged");
  if (!adminLogged) {
    res.status(401).send("Unauthorized!");
    return;
  }

  
  const form = new formidable.IncomingForm();
  console.log('adminLoggedww: ');
  form.parse(req, async function (err, fields, files) {
    //console.log('req: ', req);
    console.log("aaaaaaaaaaaaaaaaa");
    console.log('filesq: ', files);
    console.log('fieldsq: ', fields);
    res.status(201).send("Saved");
  });

}*/


export default async (req, res) => {
  //console.log('req: ', req);
  const form = new formidable.IncomingForm({});
  form.parse(req, async function (err, fields, files) {
    console.log('files: ', files);
    console.log('fields: ', fields);
    console.log('err: ', err);
    let keys = Object.keys(files);
    console.log('keys: ', keys);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      //await saveFile(files[key], fields.path);
      
    }
    return res.status(201).send("");
  });
};


/*
export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});*/