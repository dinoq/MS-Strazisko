// eslint-disable-next-line
//import classes from "./foto.module.css";

import { GetServerSideProps } from "next";
import { withIronSession } from "next-iron-session";
import { useEffect, useState } from "react";
import { useRef } from "react";
import classes from "/styles/foto.module.scss"
import Image from "next/image";
import Link from "next/link";

const Dokumenty = (props) => {
    
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        <h1 className="text-center mb-4">Dokumenty</h1>
                        <Link href="/dokumenty/gdpr.pdf"><a target="_blank" className="fw-bold h5">Dokument 1 - Informace o zpracování osobních údajů</a></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const loggedIn = req.session.get("loggedIn");

        if (!loggedIn) {
            return {
                props: { logged: false }
            };
        }

        return {
            props: { logged: true }
        };
    },
    {
        cookieName: "myapp_cookiename",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
    }
);
export default Dokumenty;