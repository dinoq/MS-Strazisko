import { useState } from "react";
import Image from "next/legacy/image"
import { useRef } from "react";

/**
 * # MY ACCOUNT GOOGLE PLAY:
 * @see {@link https://play.google.com/store/apps/developer?id=dzino Google Play}
 */

const PrivatePage = (props) => {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState("/");
  const preview = useRef<HTMLDivElement>();

  const uploadToClient = (event) => {
    if (event.target.files) {      
      const i = event.target.files[0];
      setImage(i);
    }
    
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    body.append("path", "/");
    const response = await fetch("/api/file-unused-single", {
      method: "POST",
      body
    });
  };

  const size = "400px";
  return (
    <div>
      <div>
        <div ref={preview} className="" style={{ backgroundColor: "red", width: size, height: "fit-content" }}>
          {// eslint-disable-next-line @next/next/no-img-element
            <img alt="" src={createObjectURL} style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }}></img>}
        </div>
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} multiple />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      </div>
    </div>
  )
}

export default PrivatePage;

//https://codesandbox.io/s/thyb0?file=/pages/api/file.js:24-34