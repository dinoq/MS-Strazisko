"use client"

import { useRef, useState, useActionState, useEffect } from "react";
import AlbumsLoginForm from "./AlbumsLoginForm";
import { albumLogin } from "@features/auth/actions/albumLogin";

type AlbumsLoginContainerProps = {
    year: any
}
const AlbumsLoginContainer: React.FC<AlbumsLoginContainerProps> = ({
    year
}) => {
    const pwdRef = useRef<HTMLInputElement>(null);
    const [loginState, login, pending] = useActionState(albumLogin, undefined);

    let error = "";
    if (loginState && !loginState?.ok) {
        switch (loginState.error) {
            case "wrong-pwd":
                // Špatné heslo
                error = "Špatné heslo";
                break;
            case "non-existent-album":
                // Neexistující album
                error = "Pokus o přístup k neexistujícímu albu";
                break;
            default:
                // Došlo k neznámé chybě
                error = "Došlo k neznámé chybě";
                break;
        }
    }

    return (
        <AlbumsLoginForm {...{ year, error, login, pwdRef }} />
    );
};

export default AlbumsLoginContainer;