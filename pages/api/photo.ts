import { withIronSession } from "next-iron-session";
import sharp from "sharp";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

async function handler(req, res, session) {
    const t1 = Date.now();
    let filename = req?.query?.file;
    const loggedIn = await req.session.get("loggedIn");
    res.setHeader('Content-Type', 'image/jpg');
    let imageBuffer;
    console.log('req?.query?.minify: ', req?.query?.minify);
    if(req?.query?.minify == "true"){
      imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + req.query.file)).arrayBuffer();
      imageBuffer = 
      await sharp(Buffer.from(imageBuffer))
      .resize({
        fit: sharp.fit.contain,
        width: 800
      })
      .webp()
      .toBuffer();
    }else{
      imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + req.query.file)).body;
    }

    res.send(imageBuffer);
    console.log("D:", (Date.now() - t1));
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});