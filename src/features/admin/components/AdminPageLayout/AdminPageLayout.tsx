import { FC } from "react";
import Link from "next/link";
import classes from "./AdminPageLayout.module.scss";
import { usePathname } from 'next/navigation'

type AdminPageLayoutProps = {
    children: any
}

enum PATHS {
    INTRO = "/admin/intro/intro",
    TEACHERS = "/admin/intro/teachers",
    EVENTS = "/admin/intro/events",
    PUBLIC_PHOTOS = "/admin/intro/photos",
    PRIVATE_PHOTOS = "/admin/foto",
    FOOD = "/admin/food",
    DOCUMENTS = "/admin/dokumenty",
    CONTACTS = "/admin/kontakt",
    WEB = "/"

}

const AdminPageLayout: FC<AdminPageLayoutProps> = ({
    children
}) => {
    const pathname = usePathname();

    const logout = async () => {
        const result = await fetch("/api/admin/session", {
            method: "DELETE",
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
                                        <Link href={PATHS.INTRO} className={"link" + (pathname === PATHS.INTRO? " active" : "")}>
                                            Úvodní text
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={PATHS.TEACHERS} className={"link" + (pathname === PATHS.TEACHERS? " active" : "")}>
                                            Učitelé
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={PATHS.EVENTS} className={"link" + (pathname === PATHS.EVENTS? " active" : "")}>
                                            Události
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={PATHS.PUBLIC_PHOTOS} className={"link" + (pathname === PATHS.PUBLIC_PHOTOS? " active" : "")}>
                                            Veřejné foto
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href={PATHS.PRIVATE_PHOTOS} className={"link" + (pathname === PATHS.PRIVATE_PHOTOS? " active" : "")}>
                                    Fotoalbum
                                </Link>
                            </li>
                            <li>
                                <Link href={PATHS.DOCUMENTS} className={"link" + (pathname === PATHS.DOCUMENTS? " active" : "")}>
                                    Dokumenty
                                </Link>
                            </li>
                            <li>
                                <Link href={PATHS.CONTACTS} className={"link" + (pathname === PATHS.CONTACTS? " active" : "")}>
                                    Kontakt
                                </Link>
                            </li>
                        </ul>
                        <Link href={PATHS.WEB} className={"link" + (pathname === PATHS.WEB? " active" : "")}>
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
