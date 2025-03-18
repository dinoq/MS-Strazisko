import { getIronSession } from "iron-session";
import { sessionOptions } from "../../helpers/sessionConfig";


async function handler(req, res) {
  //TODO získat heslo pro daný rok z DB
  
  const { pwd, year } = req.body;
  console.log('pwd: ', pwd);
  const rigtPwd = "skolka" + year.substring(0, 4);
  console.log('rigtPwd: ', rigtPwd);
  
  if (req.method === "POST" && pwd === rigtPwd && year) {
    const session = await getIronSession(req, res, sessionOptions);
    console.log('session1: ', session);
    let prevLoggedForYears = (session as any).loggedForYears;
    console.log('prevLoggedForYears2: ', prevLoggedForYears);
    prevLoggedForYears ??= [];
    console.log('prevLoggedForYears3: ', prevLoggedForYears);
    if(!prevLoggedForYears.includes(year)){
        (session as any).loggedForYears = [...prevLoggedForYears, year]; 
        console.log('prevLoggedForYears4: ', (session as any).loggedForYears);
        await session.save();
    }

    return res.status(200).send("");
  } else {
    return res.status(401).send("");
  }
}

export default handler;