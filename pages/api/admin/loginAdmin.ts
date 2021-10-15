import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  const { username, password } = req.body;
  if (req.method === "POST" && password === "skolkaAdmin1" && username && username === "admin") {
    req.session.set("adminLogged", true); 
    await req.session.save();
    return res.status(200).send("Successfully logged in.");
  } else {
    return res.status(403).send("Forbidden!");
  }
}

export default withIronSession(handler, {
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
  cookieName: "myapp_cookiename",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});