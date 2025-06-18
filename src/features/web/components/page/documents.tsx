// eslint-disable-next-line
//import classes from "./foto.module.css";

import Link from "next/link";

type DocumentsProps = {
    docs: Array<any>
}

const Documents: React.FC<DocumentsProps> = ({
    docs
}) => {
    const documents: Array<any> = (docs)? docs : [];    
    return <>
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10">
                    <h1 className="text-center mb-4">Dokumenty</h1>
                    {documents.map((doc, index) => {
                        const url = (doc?.filename?.startsWith("/"))? doc.filename.substring(1) : doc.filename;
                        return <div key={"doc-" + index}><Link href= {"/dokumenty/" + url} target="_blank" className="fw-bold h5">{doc.name}</Link></div>;
                    })}
                    
                </div>
            </div>
        </div>
    </>;
}

export default Documents;