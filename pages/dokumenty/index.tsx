// eslint-disable-next-line
//import classes from "./foto.module.css";

import Link from "next/link";
import { getApiURL } from "../../src/utils";

const Dokumenty = (props) => {
    const documents: Array<any> = (props.docs)? props.docs : [];    
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        <h1 className="text-center mb-4">Dokumenty</h1>
                        {documents.map((doc, index) => {
                            const url = (doc?.url?.startsWith("/"))? doc.url.substring(1) : doc.url;
                            return <div key={"doc-" + index}><Link href= {"/dokumenty/" + url}><a target="_blank" className="fw-bold h5">{doc.name}</a></Link></div>
                        })}
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dokumenty;

export const getServerSideProps = async (req, res) =>{
    let docs = await(await fetch(getApiURL("getDocuments"))).json();

    return {
        props: { docs },
      };
}