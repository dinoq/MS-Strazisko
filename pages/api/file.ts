import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log('files: ', files);
    console.log('fields: ', fields.path);
    let keys = Object.keys(files);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      await saveFile(files[key], fields.path);
      
    }
    return res.status(201).send("");
  });
};

const saveFile = async (file, path) => {
  console.log('file.path: ', file.path);
  const data = await fs.readFileSync(file.path);
  const fullPath = "./public/" + (path.startsWith("/")? "" : "/") + path + (path.endsWith("/")? "" : "/") + file.name;
  console.log('fullPath: ', fullPath);
  await fs.writeFileSync(fullPath, data);
  await fs.unlinkSync(file.path);
  return;
};

//eslint-disable-next-line
export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};


/*
fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
method: "POST",
headers: {
      'Content-Type': 'application/json',
'Authorization': 'Bearer sl.A3YwSavrH20TpuFXWFD_eJHHJa6QIbZf93Aen7-FJFxDINZ3ccHC7T_oZ_196mTkBOOfG_U4V10F3TpzaiV9F7UktnrmQ8qlsHu6n0vMljU1WoYeMQTelu4Ed7sHM_F2jMRMpIac'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
body: JSON.stringify({
    path: "/asdf"
})
})
 */