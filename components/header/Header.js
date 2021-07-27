// eslint-disable-next-line
import classes from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";
import Container8 from "../UI/Container8";

const Header = (props) => {

    let side = <div className="col-2"></div>;
    return (
        <>
            <div className={classes.header + " row"}>
                <Container8 classes="d-flex justify-content-between">
                    <div className={classes.logo}>
                        <Image src="/img/logo.png"
                            alt="Logo školky"
                            width={234}
                            height={119}
                            layout={"responsive"} />
                    </div>
                    <nav className={classes.nav}>
                        <ul className={classes.list + " d-flex"}>
                            <li className={classes.active}><Link href="#"><a>Domů</a></Link></li>
                            <li>Foto</li>
                            <li>Stravování</li>
                            <li>Dokumenty</li>
                            <li>kontakt</li>
                        </ul>
                    </nav>
                </Container8>
                {side}
            </div>
        </>
    )
}

export default Header;


// react responsive menu: https://codesandbox.io/s/responsive-hamburger-menu-in-react-forked-h3k37?file=/src/components/Toolbar.js