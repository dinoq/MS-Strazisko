import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  //TODO získat heslo pro daný rok z DB
  
  const { pwd, year } = req.body;
  const rigtPwd = "skolka" + year.substring(0, 4);
  
  if (req.method === "POST" && pwd === rigtPwd && year) {
    let prevLoggedForYears = req.session.get("loggedForYears");
    prevLoggedForYears ??= [];
    if(!prevLoggedForYears.includes(year)){
      req.session.set("loggedForYears", [...prevLoggedForYears, year]); 
      await req.session.save();
    }

    return res.status(200).send("");
  } else {
    return res.status(401).send("");
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