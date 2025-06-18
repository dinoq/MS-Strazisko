"use server"

import { prisma } from "lib/server/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { AlbumLoginResult, jwtAlbumToken } from "../types";
import { formatYear } from "lib/utils";
import { YearFormat } from "lib/types";
import { getAllLoggedYears, loginForYears } from "../lib/authFunc";

export const albumLogin = async (prev: AlbumLoginResult, formData: FormData): Promise<AlbumLoginResult> => {
    const year = formatYear(formData.get("year") as string, YearFormat.UNDERSCORE);
    const pwd = formData.get("password")?.toString() || "";

    const album = await prisma.year.findUnique({
        select: {
            password_hash: true
        },
        where: {
            id_year: year
        }
    })

    if(!album){
        return {
            ok: false,
            error: "non-existent-album"
        }
    }

    const valid = await bcrypt.compare(pwd, album.password_hash);
    
    if(!valid){
        return {
            ok: false,
            error: "wrong-pwd"
        }
    }

    let albumsID: string[] = await getAllLoggedYears();
    if(!albumsID.includes(year)){
        albumsID.push(year);
    }
    loginForYears(albumsID);

    return {
        ok: true
    }
}
