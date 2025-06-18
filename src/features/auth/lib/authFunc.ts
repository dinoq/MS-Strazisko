import "server-only"

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { jwtAlbumToken } from "../types";
import jwt from "jsonwebtoken";

export const verifyPassword = (pwd: string | undefined, hashFromDB: string) => {
    return bcrypt.compare(pwd || "", hashFromDB);
};

const ALBUM_SECRET = process.env.ALBUM_SECRET;
export const isLoggedForYear = async (year: string): Promise<boolean> => {
    if(!ALBUM_SECRET){
        throw new Error("Validation error - secret missing")
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("album_access")?.value || "";
    let logged = false;
    if (token) {
        try {
            const decoded = jwt.verify(token, ALBUM_SECRET) as jwtAlbumToken;

            logged = decoded.data.includes(year);
            if (logged) {
                return true;
            }
        } catch (e) {
            return false;
        }
    }

	return false;	
};

export const loginForYears = async (albumsID: Array<string>) =>{
    if(!ALBUM_SECRET){
        throw new Error("Validation error - secret missing")
    }

    const cookieStore = await cookies();

    const token = jwt.sign({data: albumsID}, ALBUM_SECRET, { expiresIn: '10m' });
    cookieStore.set("album_access", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
}

export const getAllLoggedYears = async () => {
    if(!ALBUM_SECRET){
        throw new Error("Validation error - secret missing")
    }

    const cookieStore = await cookies();
    const cookieStorage = await cookies();

    let albumsID: string[] = [];
    try{
        const oldToken = (cookieStorage).get("album_access")?.value;
        if(oldToken){
            albumsID = (jwt.verify(oldToken, ALBUM_SECRET) as jwtAlbumToken)?.data || [];
        }
    }catch{
    }

    return albumsID;
}