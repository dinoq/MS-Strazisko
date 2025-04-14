// lib/sessionConfig.ts

import { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
    password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
    cookieName: "myapp_cookiename",
    cookieOptions: {
        secure: true/*process.env.NODE_ENV === "production"*/,
    },
};

