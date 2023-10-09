import { FC } from "react";
import Link from "next/link";
import classes from "./AdminPageLayout.module.scss";

type AdminPageLayoutProps = {
    children: any
}
const AdminPageLayout: FC<AdminPageLayoutProps> = ({
    children
}) => {
    const logout = async () => {
        const result = await fetch("/api/admin/logoutAdmin", {
            method: "POST",
            mode: "same-origin",
        });
        if (result.status === 200) {
            window.location.replace("/admin");
        }
    };

    return (
        <div className={classes.layout + ""}>
            <div className="">
                <div className={classes.header + ""}>
                    <div className={classes.leftSide}></div>
                    <div className={classes.rightSide}>
                        <span className={classes.span}>Admin</span>
                        <span className={classes.span + " link cursor-pointer"} onClick={logout}>
                            Odhlásit se
                        </span>
                    </div>
                </div>
            </div>
            <div className={classes.main}>
                <div className={classes.sider}>
                    <div className={classes.menuItemsWrapper}>
                        <ul aria-label="Menu">
                            <li>

                                <ul aria-label="Úvodní strana">
                                    <li>
                                        <Link href="/admin/intro/intro" className={"link"}>
                                            Úvodní text
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/teachers" className={"link"}>
                                            Učitelé
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/events" className={"link"}>
                                            Události
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/photos" className={"link"}>
                                            Foto
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href="/admin/foto" className={"link"}>
                                    Fotoalbum
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/food" className={"link"}>
                                    Jídelníček
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/dokumenty" className={"link"}>
                                    Dokumenty
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/kontakt" className={"link"}>
                                    Kontakt
                                </Link>
                            </li>
                        </ul>
                        <Link href="/" className={"link"}>
                            &lt; Zpět na web
                        </Link>
                    </div>
                </div>
                <div className={classes.content + " "}>{children}</div>
            </div>
        </div>
    );
};

export default AdminPageLayout;
