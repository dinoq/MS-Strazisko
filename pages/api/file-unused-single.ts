import formidable from "formidable";
import fs from "fs";
/*
export const config = {
  api: {
    bodyParser: false
  }
};
*/
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log('filesuuuuu: ', files);
    console.log('fieldsuuuuu: ', fields);
    let keys = Object.keys(files);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      //await saveFile(files[key], fields.path);
      
    }
    return res.status(201).send("");
  });
};
