"use client"

import { RefObject, } from "react";
import classes from "./AlbumsLogin.module.scss"

type LoginProps = {
    year: any,
    error: string,
    login: (payload: FormData) => void,//(event: any) => Promise<void>,
    pwdRef: RefObject<HTMLInputElement|null>
}
const AlbumsLoginForm: React.FC<LoginProps> = ({
    year,
    error,
    login,
    pwdRef
}) => {

    return (
        <>
            <div className="d-flex flex-column align-items-center">
                {error.length !== 0 && (
                    <div className="alert alert-danger text-center" role="alert">
                        { error }
                    </div>
                )}
                <form action={login} className={classes.login}>
                    <div>
                        Pro přístup ke fotogalerii musíte zadat heslo:
                    </div>
                    <input value={year} type="text" name="year" readOnly  />
                    <input ref={pwdRef} type="password" name="password" />
                    <input type="submit" value="Odeslat" />
                </form>
            </div>
        </>
    );
};

export default AlbumsLoginForm;