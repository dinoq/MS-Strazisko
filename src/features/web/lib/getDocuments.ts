import { prisma } from "lib/server/prisma";

// Získání školních dokumentů z databáze - není vyžadováno přihlášení
const getDocuments = async () => {
    const documents = await prisma.document.findMany();
    return documents;
}


export default getDocuments;