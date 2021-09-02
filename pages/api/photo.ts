import { NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import sharp from "sharp";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

async function handler(req, res: NextApiResponse, session) {
    const t1 = Date.now();
    let filename = req?.query?.file;
    let year = req?.query?.year;
    const loggedForYear = await req.session.get("loggedForYear");
    if(loggedForYear == year){
      res.setHeader('Content-Type', 'image/jpg');
      let imageBuffer;
      if(req?.query?.minify == "true"){
        imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + req.query.file)).arrayBuffer();
        imageBuffer = 
        await sharp(Buffer.from(imageBuffer))
        .resize({
          fit: sharp.fit.contain,
          width: 400
        })
        .webp()
        .toBuffer();
      }else{
        imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + req.query.file)).body;
      }
  
      res.send(imageBuffer);
    }else{
      res.status(401).send("Unauthorized!"+loggedForYear+","+year);
    }
    console.log("D:", (Date.now() - t1));
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});