import { useState } from "react";
import Image from "next/image"
import { useRef } from "react";

/**
 * # MY ACCOUNT GOOGLE PLAY:
 * @see {@link https://play.google.com/store/apps/developer?id=dzino Google Play}
 */

const PrivatePage = (props) => {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState("/");
  const preview = useRef<HTMLDivElement>();


  const [images, setImages] = useState([]);

  const uploadToClient = (event) => {
    console.log('event.target.files: ', event.target.files);
    if (event.target.files) {      
      if( Array.from(event.target.files).length === 1){
        const i = event.target.files[0];
        console.log('i: ', i);
        console.log('URL.createObjectURL(i): ', URL.createObjectURL(i));
  
        setImage(i);
        //setCreateObjectURL("/"+i.name);
        let img = (preview?.current?.children[0] as HTMLImageElement)
        img.src = URL.createObjectURL(i);
      }else 
      if( Array.from(event.target.files).length > 1){
        console.log("multiple: ", event.target.files.lenght);
        setImages([]);
  
        let imgs = new Array();
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          imgs.push(file);
        }
        setImages(imgs);
      }
    }
    
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      body.append("file-" + i, img);
    }
    body.append("path", "/");
    const response = await fetch("/api/file-unused", {
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