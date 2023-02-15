import Link from "next/link";
import classes from "./AdminPageLayout.module.scss";

const AdminPageLayout = (props) => {
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
                                        <Link href="/admin/intro/intro">
                                            <a className={"link"}>Úvodní text</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/teachers">
                                            <a className={"link"}>Učitelé</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/events">
                                            <a className={"link"}>Události</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/intro/photos">
                                            <a className={"link"}>Foto</a>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href="/admin/foto">
                                    <a className={"link"}>Fotoalbum</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/food">
                                    <a className={"link"}>Jídelníček</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/dokumenty">
                                    <a className={"link"}>Dokumenty</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/kontakt">
                                    <a className={"link"}>Kontakt</a>
                                </Link>
                            </li>
                        </ul>
                        <Link href="/">
                            <a className={"link"}>&lt; Zpět na web</a>
                        </Link>
                    </div>
                </div>
                <div className={classes.content + " "}>{props.children}</div>
            </div>
        </div>
    );
};

export default AdminPageLayout;
