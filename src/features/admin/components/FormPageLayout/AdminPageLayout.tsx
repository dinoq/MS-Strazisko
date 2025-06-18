"use client"

import { FC } from "react";
import Link from "next/link";
import classes from "./AdminPageLayout.module.scss";
import { usePathname } from 'next/navigation'
import { PathInfo } from "@features/admin/types";
import { signOut } from "next-auth/react";

type AdminPageLayoutProps = {
    children: any
}

enum PATHS {
    INTRO = "/admin/intro",
    TEACHERS = "/admin/teachers",
    EVENTS = "/admin/events",
    PUBLIC_PHOTOS = "/admin/photos",
    PRIVATE_PHOTOS = "/admin/foto",
    FOOD = "/admin/food",
    DOCUMENTS = "/admin/dokumenty",
    CONTACTS = "/admin/kontakt",
    WEB = "/"

}
const paths: PathInfo[] = [
    { title: "Úvodní strana", children: [
        {title: "Úvodní text", url: "/admin/intro"},
        {title: "Učitelé", url: "/admin/teachers"},
        {title: "Události", url: "/admin/events"},
        {title: "Veřejné foto", url: "/admin/photos"}
    ]},
    { title: "Fotoalbum", url: "/admin/foto"},
    { title: "Dokumenty", url: "/admin/dokumenty"},
    { title: "Kontakt", url: "/admin/kontakt"},
]

const AdminPageLayout: FC<AdminPageLayoutProps> = ({
    children
}) => {
    const pathname = usePathname();

    const renderPathInfo = (info: PathInfo) => {
        if("children" in info){
            return (
                <ul key={info.title} aria-label="Úvodní strana">
                    {info.children.map(childrenInfo => renderPathInfo(childrenInfo))}
                </ul>
            )
        }else{
            return (
                <li key={info.url}>
                    <Link href={info.url} className={"link" + (pathname === info.url? " active" : "")}>
                        {info.title}
                    </Link>
                </li>
            )
        }
    }

    return (
        <div className={classes.layout + ""}>
            <div className="">
                <div className={classes.header + ""}>
                    <div className={classes.leftSide}></div>
                    <div className={classes.rightSide}>
                        <span className={classes.span}>Admin</span>
                        <span className={classes.span + " link cursor-pointer"} onClick={()=> signOut()}>
                            Odhlásit se
                        </span>
                    </div>
                </div>
            </div>
            <div className={classes.main}>
                <div className={classes.sider}>
                    <div className={classes.menuItemsWrapper}>
                        <ul aria-label="Menu">
                            {
                                paths.map(path => renderPathInfo(path))
                            }
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
