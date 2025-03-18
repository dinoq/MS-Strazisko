// eslint-disable-next-line
//import classes from "./foto.module.css";

import Link from "next/link";
import { getApiURL } from "../../helpers/utils";

type DokumentyProps = {
    docs: Array<any>
}

const Dokumenty = ({
    docs
}) => {
    const documents: Array<any> = (docs)? docs : [];    
    return <>
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10">
                    <h1 className="text-center mb-4">Dokumenty</h1>
                    {documents.map((doc, index) => {
                        const url = (doc?.url?.startsWith("/"))? doc.url.substring(1) : doc.url;
                        return <div key={"doc-" + index}><Link href= {"/dokumenty/" + url} target="_blank" className="fw-bold h5">{doc.name}</Link></div>;
                    })}
                    
                </div>
            </div>
        </div>
    </>;
}

export const getServerSideProps = async (_context) => {
    let docs = await(await fetch(getApiURL("getDocuments"))).json();

    return {
        props: { docs },
      };
}

export default Dokumenty;