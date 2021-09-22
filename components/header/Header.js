// eslint-disable-next-line
import classes from "./Header.module.scss";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";

const Header = (props) => {
    const [scrollY, setScrollY] = useState(0);
    const [headerExpanded, setHeaderExpanded] = useState(false);
    const [menuExpanded, setMenuExpanded] = useState(false);


    const toggleHamburgerMenu = e => {
        setMenuExpanded(prevVal => {
            return !prevVal;
        })
    }


    const router = useRouter();

    const navigation = [["/", "Domů"], ["/foto", "Foto"], ["/stravovani", "Stravování"], ["/dokumenty", "Dokumenty"], ["/kontakt", "Kontakt"]];
    const links = navigation.map((link, index) => {
        let className = "";
        if(router.asPath === link[0] || router.asPath.includes(link[0] + "/")){
            className = classes.active;
        }
        return <Link key={"menu-link-" + index} href={link[0]}><a><li onClick={toggleHamburgerMenu} className={className}>{link[1]}</li></a></Link>
    }
    );

    
    const isHomePage = router.asPath === navigation[0][0];


    const handleNavigation = useCallback(
        e => {
            const window = e.currentTarget;
            if (scrollY > window.scrollY && window.scrollY < 50 && !headerExpanded) { // scrolling up
                setHeaderExpanded(true);
            } else if (scrollY < window.scrollY && window.scrollY > 80 && headerExpanded) { // scrolling down
                setHeaderExpanded(false);

            }
            setScrollY(window.scrollY);
        }, [scrollY]
    );

    useEffect(() => {
        setScrollY(window.scrollY);
        window.addEventListener("scroll", handleNavigation);

        return () => {
            window.removeEventListener("scroll", handleNavigation);
        };
    }, [handleNavigation]);


    useEffect(() => {
        const root = document.documentElement;
        root?.style.setProperty(
            "--navbar-items-count", links.length
        );
    }, [links.length]);

    return (
        <>
            <div className={classes.header + " " + (headerExpanded ? classes["header-expanded"] : "") + " container-fluid row justify-content-center"}>
                <div className={"col-8 d-flex justify-content-between align-items-center flex-wrap"}>
                    <div className={classes["logo-container"] + " d-flex align-items-center"}>
                        {/* <Image src="/img/logo.png"
                            alt="Logo školky"
                            width={234}
                            height={119}
                            layout={"responsive"} /> */}
                        <span id="logo">MŠ Stražisko</span>
                    </div>
                    <div className={classes["hamburger-menu-container"] + " d-flex flex-column justify-content-evenly d-lg-none"} onClick={toggleHamburgerMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <nav className={classes.nav + (menuExpanded ? " " + classes["menu-expanded"] : "") /*+ " d-none d-lg-flex"*/}>
                        <ul className={classes.list + " d-flex"}>
                            {links}
                        </ul>
                    </nav>
                </div>
            </div>
            {!props.noBackground &&
                <div className="container-fluid">
                    <div className="row mb-4">
                        <div className={classes.hero + " col-12 " + (!isHomePage? classes.shifted : "")}>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Header;


// react responsive menu: https://codesandbox.io/s/responsive-hamburger-menu-in-react-forked-h3k37?file=/src/components/Toolbar.js