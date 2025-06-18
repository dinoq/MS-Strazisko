"use client"

import type { NextPage } from 'next';
import { useState } from 'react';
import styles from './login.module.scss';
import { signIn } from "next-auth/react";


const AdminLogin: NextPage = (props: any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginFormSubmitted = async (event) => {
        event.preventDefault();

        const res = await signIn("credentials", {
            username,
            password,
            redirect: true,
            callbackUrl: "/admin/intro"
        })

        if(res?.error){
            setError(res.error);
        }
    }
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.formWrapper}>
                    {error}
                    <div className={styles.title}>Přihlášení do administrace</div>
                    <form className={styles.form} onSubmit={loginFormSubmitted}>
                        <input type="text" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                        <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} required />
                        <input className={"button"} type="submit" value="Přihlásit!" />
                    </form>
                </div>
            </main>
        </div>
    )
}


export default AdminLogin;