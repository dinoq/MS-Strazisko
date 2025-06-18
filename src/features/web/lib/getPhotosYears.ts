import { prisma } from "lib/server/prisma";

// Získání školních roků z databáze - není vyžadováno přihlášení
const getPhotosYears = async () => {
    const years1 = await prisma.year.findMany({
        where: {
            Album: {
                some: {
                    PrivatePhoto: {
                        some: {},
                    },
                },
            },
        },
        distinct: ["id_year"],
    });
    let years: Array<string> = years1.map(year => year.id_year);
    return years;
};

export default getPhotosYears;
