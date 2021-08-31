import { withIronSession } from "next-iron-session";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

async function handler(req, res, session) {
    let filename = req?.query?.file;
    const loggedIn = await req.session.get("loggedIn");
    res.setHeader('Content-Type', 'image/jpg');
    let imageBuffer;
    imageBuffer = await (await fetch('https://ms-strazisko.cz/fileserver/getFile.php?file=' + req.query.file)).body;
    res.send(imageBuffer);
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});