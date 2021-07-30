// eslint-disable-next-line
import classes from "../../styles/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const Header = (props) => {
    const [scrollY, setScrollY] = useState(0);
    const [expandedClass, setExpandedClass] = useState("expanded");

    const handleNavigation = useCallback(
        e => {
          const window = e.currentTarget;
          if (scrollY > window.scrollY && window.scrollY < 50 && !expandedClass.length) { // scrolling up
            console.log("rozsirit");
            setExpandedClass("expanded");
          } else if (scrollY < window.scrollY && window.scrollY > 50 && expandedClass.length) { // scrolling down
            console.log("zuzit");
            setExpandedClass("");
            
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

    return (
        <>
            <div className={classes.header + " " + (expandedClass? classes.expanded : "") + " row justify-content-center"}>
                <div className={"col-8 d-flex justify-content-between"}>
                    <div className={classes["logo-container"] + " d-flex align-items-center"}>
                        {/* <Image src="/img/logo.png"
                            alt="Logo školky"
                            width={234}
                            height={119}
                            layout={"responsive"} /> */}
                        <span id="logo">MŠ Stražisko</span>
                    </div>
                    <nav className={classes.nav}>
                        <ul className={classes.list + " d-flex"}>
                            <li className={classes.active}><Link href="/"><a>Domů</a></Link></li>
                            <li>Foto</li>
                            <li>Stravování</li>
                            <li>Dokumenty</li>
                            <li>kontakt</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Header;


// react responsive menu: https://codesandbox.io/s/responsive-hamburger-menu-in-react-forked-h3k37?file=/src/components/Toolbar.js