import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const modelMap = {
    IntroText: prisma.introText,
    Teacher: prisma.teacher,
    Event: prisma.event,
    PublicPhoto: prisma.publicPhoto,
    PrivatePhoto: prisma.privatePhoto,
    Album: prisma.album,
    Document: prisma.document,
    Year: prisma.year,
    ContactText: prisma.contactText
    // přidej další modely, které chceš podporovat
};

export type ModelName = keyof typeof modelMap;

export type ModelClient = (typeof modelMap)[ModelName];

export const getModelByClassName = (
    className: string
): {success: boolean, error?: string, model?: any} => {
    const model = modelMap[className as ModelName] as any;
    if (!model) {
        return {
            success: false,
            error: "Invalid Model",
        };
    }
    return {
        success: true,
        model,
    };
};
