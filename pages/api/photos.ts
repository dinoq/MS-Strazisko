import { withIronSession } from "next-iron-session";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

async function handler(req, res, session) {
    const loggedIn = await req.session.get("loggedIn");
    if (loggedIn) {    
        res.send({
            albums
        })
    } else {
        res.send({
            albums:
                []
        })
    }
}

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});