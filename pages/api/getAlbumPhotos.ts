import { withIronSession } from "next-iron-session";

const albums = ["https://www.ms-strazisko.cz/img/skolka.jpeg"];

const handler = async (req, res)=>{
    const pageYear = req.query["year"];
    console.log('requrllllllpageYearpageYear: ', pageYear);

    const loggedForYears: Array<any> = await req.session.get("loggedForYears");
    console.log('req.session: ', req.session);
    console.log('loggedForYears: ', loggedForYears);
    if(!loggedForYears || !loggedForYears.length || !loggedForYears.includes(pageYear)){
      res.status(401).send("Unauthorized!");
      return;
    }
 
    res.send({
        albums
    })
}   

export default withIronSession(handler, {
  cookieName: "myapp_cookiename",
  cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
});