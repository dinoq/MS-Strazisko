

async function handler(req, res) {
  try {
    req.session.adminLogged = false; 
    await req.session.save();
    return res.status(200).send("Successfully logged out.");
  } catch (error) {
    return res.status(501).send("Internal Server Error!");
  }
}

export default handler;