import Documents from "@features/web/components/page/documents"
import getDocuments from "@features/web/lib/getDocuments";

const DocumentsPage = async () => {
    const docs = await getDocuments();
    
    return <Documents docs={docs} />
}

export default DocumentsPage;