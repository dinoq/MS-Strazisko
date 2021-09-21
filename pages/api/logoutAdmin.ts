import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  try {
    req.session.set("adminLogged", false); 
    await req.session.save();
    return res.status(200).send("Successfully logged out.");
  } catch (error) {
    return res.status(501).send("Internal Server Error!");
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