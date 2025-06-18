import { NextRequest, NextResponse } from "next/server";
import { checkIfNotDangerSQL, isValidClassName } from "FilesToDistribute/utils";
import { getModelByClassName, prisma } from "lib/server/prisma";
import { nextResponse200OK, nextResponse404Error, nextResponse500Error } from "@features/data/lib/serverResponses";

const fakeTables = ["events", "teachers", "public_images", "contact_texts", "food", "intro"];
const realTables = ["Event", "Teacher", "PublicPhoto", "ContactText", "Food", "IntroText"];

const mapTables = (table: string, toReal: boolean)=>{
    if(toReal){
        return realTables[fakeTables.indexOf(table)];
    }else{
        return fakeTables[realTables.indexOf(table)];
    }
}

const mapConditionsAndOrder = (table) =>{
    if(table == "Event"){
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0); // důležité: UTC, aby sedělo s uloženými daty v DB
        return {date: {
            gte: now
        }}
    }
    return {};
}

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    let tablesString: string | null = searchParams.get("table");
    if (!tablesString) {
        return nextResponse404Error("Table not specified!");
    }

    let data = {};
    try {
            let tables = tablesString.split(";");

            for(const tableName of tables){
                const className =  mapTables(tableName, true);
                
                if (!isValidClassName(className) || !checkIfNotDangerSQL(className)) { // bezpečnostní pojistka                    
                    return nextResponse404Error("ERROR - wrong data className, condition or order!");
                }

                const modelData = getModelByClassName(className);
                if (modelData.error || !modelData.model) {
                    return nextResponse500Error(modelData.error || "Invalid Model");
                }
                const model = modelData.model;
                let where = mapConditionsAndOrder(className);
                const entries = await model.findMany({
                    where,
                });

                data[tableName] = entries;
            }
            
            return nextResponse200OK("OK", data);
    } catch (error) {
        return nextResponse500Error("Internal Server Error! Error in database!");
    }
}