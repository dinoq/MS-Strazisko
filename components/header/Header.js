// eslint-disable-next-line
import classes from "../../styles/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";

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


  /**
   * <li className={classes.active}><Link href="/"><a>Domů</a></Link></li>
                        <li><Link href="/foto"><a>Foto</a></Link></li>
                        <li><Link href="/stravovani"><a>Stravování</a></Link></li>
                        <li><Link href="/dokumenty"><a>Dokumenty</a></Link></li>
                        <li><Link href="/kontakt"><a>Kontakt</a></Link></li>
   */
  const router = useRouter();
  console.log(router.pathname);
  console.log(router);
  const navigation = [["/", "Domů"], ["/foto", "Foto"], ["/stravovani", "Stravování"], ["/dokumenty", "Dokumenty"], ["/kontakt", "Kontakt"]];
  const links = navigation.map((link, index, array) =>
    <li key={link[0]} className={router.pathname == link[0] ? classes.active : ""}><Link key={index} href={link[0]}><a>{link[1]}</a></Link></li>
  );
  return (
    <>
      <div className={classes.header + " " + (expandedClass ? classes.expanded : "") + " row justify-content-center"}>
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
              {links}
            </ul>
          </nav>
        </div>
      </div>

    </>
  )
}

export default Header;


// react responsive menu: https://codesandbox.io/s/responsive-hamburger-menu-in-react-forked-h3k37?file=/src/components/Toolbar.js