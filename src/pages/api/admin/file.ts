import { withIronSessionApiRoute } from "iron-session/next";
import formidable from "formidable";
import fs from "fs";
import sharp from "sharp"


export const config = {
    api: {
        bodyParser: false
    }
};
const handler = async (req, res) => {
    if (req.method == "POST") {

        const form = new formidable.IncomingForm();
        try {
            await form.parse(req, async function (err, fields, files) {
                
                let keys = Object.keys(files);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const path = fields["path" + i];
                    await saveFile(files[key], path);
                }
            });
            return res.status(200).send("asd");

        } catch (error) {
            return res.status(500).send("ERROR - cannot parse submitted form!");

        }
    } else {
        return res
            .status(500)
            .send("ERROR - unknown HTTP method '" + req.method + "'");
    }
};

const saveFile = async (file, url) => {
    let data = await fs.readFileSync(file.path);
    const fullPath = "./public" + (url.startsWith("/") ? "" : "/") + url;

    const minify = true;
    if (file?.type?.includes("image") && minify) {
        data =
        await (sharp(data)
        .resize({
            fit: sharp.fit.inside,
            width: 1920,
            height: 1080,
        }).webp({ quality: 80 })
        .toFile(fullPath));
    } else {
        const resultt = await fs.writeFileSync(fullPath, data);
    }
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
