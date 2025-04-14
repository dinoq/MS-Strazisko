// pages/api/admin/session.ts
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../features/auth/sessionConfig"; // Adjust the path accordingly

async function handler(req, res) {
    const session = await getIronSession(req, res, sessionOptions);
    if (req.method === "POST") {
        const { username, password } = req.body;
        if (password === "skolkaAdmin1" && username && username === "admin") {
            (session as any).adminLogged = true;
            await session.save();
            res.send({ ok: true });
        } else {
            console.log('Forbidden access attempt with username: ', username);
            return res.status(403).send("Forbidden!");
        }
    } else if (req.method === "DELETE") {
        try {
            //const session = await getIronSession(req, res, sessionOptions);
            (session as any).adminLogged = false; 
            await session.save();
            return res.status(200).send("Successfully logged out.");
        } catch (error) {
            console.error('Error saving session: ', error);
            return res.status(501).send("Internal Server Error!");
        }
    } else {
        console.log('Method Not Allowed');
        return res.status(405).send("Method Not Allowed!");
    }
}

export default handler;
