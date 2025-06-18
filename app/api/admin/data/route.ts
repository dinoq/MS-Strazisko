import { getRawDBObjectDefinition } from "@features/data/definitions/db-object-definitions";
import { nextResponse200OK, nextResponse400Error, nextResponse500Error } from "@features/data/lib/serverResponses";
import { ServerResponse } from "@features/data/lib/types";
import { DBObjectAttr } from "FilesToDistribute/types";
import { checkIfNotDangerSQL, isValidClassName } from "FilesToDistribute/utils";
import {
    getModelByClassName,
    ModelClient,
    modelMap,
    ModelName,
    prisma,
} from "lib/server/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;

    const className: string = searchParams.get("className") || "";
    let condition: string = searchParams.get("condition") || "";
    condition = condition.length ? " " + condition.trim() : "";
    const order: string = searchParams.get("order") || "";

    if (!className) {
        return nextResponse500Error("ERROR - className not received!");
    }
    if (
        !isValidClassName(className) ||
        !checkIfNotDangerSQL([condition, order])
    ) {
        // bezpečnostní pojistka
        return nextResponse500Error("ERROR - wrong data className, condition or order!");
    }

    const modelData = getModelByClassName(className);
    if (modelData.error || !modelData.model) {
        return nextResponse500Error(modelData.error || "Invalid Model");
    }
    const model = modelData.model;

    let where = {};
    let orderBy: any = undefined;

    try {
        if (condition) {
            console.log("condition: ", JSON.parse(condition));
            where = JSON.parse(condition);
        }
        if (order) {
            const [attr, direction] = order.split("|");
            const orderObj = {};
            orderObj[attr] = direction;
            orderObj[order];
            orderBy = [orderObj];
        }
    } catch (e) {
        return nextResponse400Error("Invalid JSON in query params");
    }

    const entries = await model.findMany({
        where,
        orderBy,
    });

    if (entries.length) {
        let DBObjectDefinitionPersistentAttrs: Array<DBObjectAttr> =
            getRawDBObjectDefinition(className).persistentAttributes ?? [];
        for (const attr of DBObjectDefinitionPersistentAttrs) {
            if (attr.source) {
                let firstDotIndex = attr.source.indexOf(".");
                let tildaIndex = attr.source.indexOf("~");
                if (firstDotIndex != -1 && tildaIndex != -1) {
                    let foreignClassName;
                    if (attr.source.startsWith("*")) {
                        // Daný atribut je pro všechny položky dané třídy stejný
                        foreignClassName = attr.source.substring(
                            1,
                            firstDotIndex
                        );
                        let foreignAttrName = attr.source.substring(
                            firstDotIndex + 1,
                            tildaIndex
                        );
                        let foreignConditionAttrName = attr.source.substring(
                            tildaIndex + 1
                        );
                        const foreignModel = (modelMap as any)[
                            foreignClassName as ModelName
                        ];
                        if (!foreignModel) {
                            return nextResponse400Error("Invalid foreign model");
                        }
                        const foreignData = await foreignModel.findMany({
                            where: {
                                [foreignConditionAttrName]:
                                    entries[0][foreignConditionAttrName],
                            },
                        });
                        for (const entry of entries) {
                            entry[`${foreignClassName}.${foreignAttrName}`] =
                                foreignData[0][foreignAttrName];
                        }
                    } else {
                        // Daný atribut může pro každou položku nabývat jiné hodnoty
                        foreignClassName = attr.source.substring(
                            0,
                            firstDotIndex
                        );
                        return nextResponse500Error("ERROR - not implemented binding without *! TODO!");
                    }
                }
            }
            // if (!DBObjectDefinitionAttrs.find(definitionAttr => definitionAttr.key == attrKey)) {
            // 	return nextResponse500Error.json("ERROR - wrong attribute key! Attribute '" + attrKey + "' is not in class '" + className + "'");
            // }
        }
    }
    return nextResponse200OK("OK", entries);
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const className = body["className"] || "";
    const attrs = body["attributes"] || {};

    if (
        !isValidClassName(className) ||
        !attrs ||
        Array.isArray(attrs) ||
        typeof attrs != "object"
    ) {
        // bezpečnostní pojistka
        return nextResponse500Error("ERROR - wrong data className or attribute!");
    }
    if (!className) {
        return nextResponse500Error("ERROR - className not received!");
    }

    try {
        const modelData = getModelByClassName(className);
        if (modelData.error || !modelData.model) {
            return nextResponse500Error(modelData.error || "Invalid Model");
        }
        const model = modelData.model;

        await model.create({
            data: { ...attrs },
        });
    } catch (error) {
        console.log("ERROR 2! " + error.message);
        if(error.message?.includes("Unique constraint failed on the fields")){
            return nextResponse500Error("Došlo k chybě s jedinečností primárního klíčem (pravděpodobně se snažíte vytvořit stejný záznam podruhé)");
        }
        return nextResponse500Error(
            process.env.NODE_ENV === "production"
                ? "Došlo k neznámé chybě!"
                : "ERROR 2! " + error);
    }
    return nextResponse200OK();
};

export const PATCH = async (req: NextRequest) => {
    const body = await req.json();
    const className = body["className"] || "";
    const attrs = body["attributes"] || {};
    const updateId = body["updateId"] || "";
    const primaryKey: string = body["primaryKey"] || "";

    if (
        !isValidClassName([className, updateId, primaryKey]) ||
        !attrs ||
        Array.isArray(attrs) ||
        typeof attrs != "object"
    ) {
        // bezpečnostní pojistka
        console.log(
            "className, updateId, primaryKey: ",
            className,
            updateId,
            primaryKey
        );
        return nextResponse500Error("ERROR - wrong data className, updateId, primaryKey or attrs!");
    }
    if (!className || !updateId || !primaryKey) {
        return nextResponse500Error("ERROR - className, primary key or updateId not received!");
    }
    try {
        const modelData = getModelByClassName(className);
        if (modelData.error || !modelData.model) {
            return nextResponse500Error(modelData.error || "Invalid Model");
        }
        const model = modelData.model;
        await model.update({
            data: { ...attrs },
            where: {
                [primaryKey]: updateId,
            },
        });
    } catch (error) {
        return nextResponse500Error("ERROR 3! " + (process.env.NODE_ENV === "production" ? "" : error));
    }
    return nextResponse200OK();
};

export const DELETE = async (req: NextRequest) => {
    const body = await req.json();
    const className = body["className"] || "";
    const detailClass = body["detailClass"] || "";
    const primaryKey: string = body["primaryKey"] || "";
    const deleteId = body["deleteId"] || "";
    const forceDelete = body["forceDelete"] || false;
    const forceDeleteItemMsg = body["forceDeleteItemMsg"] || "";

    if (!isValidClassName([className, detailClass, primaryKey, deleteId])) {
        console.log('className, detailClass, primaryKey, deleteId: ', className, detailClass, primaryKey, deleteId);
        // bezpečnostní pojistka
        
        return nextResponse500Error("ERROR - wrong data className, detailClass, primaryKey or deleteId!");
    }
    if (!className || !primaryKey || !deleteId) {
        console.log(
            "className, primaryKey, deleteId: ",
            className,
            primaryKey,
            deleteId
        );
        return nextResponse500Error("ERROR - className, primary key or deleteID not received!");
    }

    try {
        if (detailClass) {
            const detailModelData = getModelByClassName(detailClass);
            if (detailModelData.error || !detailModelData.model) {
                return nextResponse500Error(detailModelData.error || "Invalid Model");
            }
            const detailModel = detailModelData.model;
            const children = await detailModel.findMany({
                where: {
                    [primaryKey]: deleteId
                }
            })

            if (children.length) {
                if (forceDelete){ // Při force delete se v prvé řadě smažou navázané záznamy z druhé tabulky
                    await detailModel.deleteMany({
                        where: {
                            [primaryKey]: deleteId
                        }
                    })
                } else {
                    // Pokud neni forceDelete - nemuze se smazat záznam, pokud obsahuje nejaka podrizena data (v podrizene tabulce)
                    let msg =
                        typeof forceDeleteItemMsg == "string" &&
                        forceDeleteItemMsg.length
                            ? forceDeleteItemMsg
                            : "Chyba! Daný záznam zřejmě obsahuje nějaká podřízená data.<br>Nejprve musíte smazat je (přes 'Detail') a až potom tento záznam!";
                    
                    return nextResponse500Error(msg);
                }
            }
        }

        const modelData = getModelByClassName(className);
        if (modelData.error || !modelData.model) {
            return nextResponse500Error(modelData.error || "Invalid Model");
        }
        const model = modelData.model;
        await model.delete({
            where:{
                [primaryKey]: deleteId
            }
        })
    } catch (error) {
        console.log("ERROR 1! " + error);
        
        return nextResponse500Error(
            process.env.NODE_ENV === "production"
                    ? "Došlo k neznámé chybě!"
                    : "ERROR 1! " + error);
    }
    return nextResponse200OK();
};
