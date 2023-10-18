import { withIronSessionApiRoute } from "iron-session/next";


async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;
        if (password === "skolkaAdmin1" && username && username === "admin") {
            req.session.adminLogged = true;
            await req.session.save();
            return res.status(200).send("Successfully logged in.");
        } else {
            return res.status(403).send("Forbidden!");
        }
    } else if (req.method === "DELETE") {
        try {
          req.session.adminLogged = false; 
          await req.session.save();
          return res.status(200).send("Successfully logged out.");
        } catch (error) {
          return res.status(501).send("Internal Server Error!");
        }
    } else {
        return res.status(405).send("Method Not Allowed!");
    }
}

export default withIronSessionApiRoute(handler, {
    password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
    cookieName: "myapp_cookiename",
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});