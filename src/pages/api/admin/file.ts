import { withIronSessionApiRoute } from "iron-session/next";
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
      bodyParser: false
    }
  };
const handler = (req, res) => {
  if (req.method == "POST") {
      
    const form = new formidable.IncomingForm();
    try {
        form.parse(req, async function (err, fields, files) {
            console.log('fields: ', fields);
          let keys = Object.keys(files);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const path = fields["path"+i];
            console.log('path: ', path);
            await saveFile(files[key], path);
          }
          return res.status(200).send("asd");
        });
        
    } catch (error) {
        console.log('errorrrrrrrr: ', error);
        
    }
  } else {
    return res
      .status(500)
      .send("ERROR - unknown HTTP method '" + req.method + "'");
  }
};



const saveFile = async (file, url) => {
    const data = await fs.readFileSync(file.path);
    const fullPath = "./public" + (url.startsWith("/") ? "" : "/") + url;
    const resultt = await fs.writeFileSync(fullPath, data);
    console.log('resultt: ', resultt);
    await fs.unlinkSync(file.path); // remove temp file
    return;
  };

export default withIronSessionApiRoute(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});
