// eslint-disable-next-line
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "./Footer.module.scss";

type FooterProps = {

}

const Footer: React.FC<FooterProps> = ({

}) => {
    const router = useRouter();

    const [contactText, setContactText] = useState({ tel: "", email: "" });

    useEffect(() => {
        fetch("/api/data?table=contact_texts").then((data) => {
            data.json().then(json => {

                const email = (json.contact_texts.find((text) => { return text.title == "Email" })).content;
                const tel = (json.contact_texts.find((text) => { return text.title == "Telefon" })).content;
                setContactText(prevState => {
                    return { ...prevState, email, tel }
                });
            })

        })

    }, [])
    return (
        <div className={classes["footer"] + " pt-4 container-fluid "/* + offsetClass*/}>
            <div className={" row justify-content-center text-center text-white"}>
                <div className="col-10 p-4 d-flex flex-column justify-content-center">
                    <div className="row my-2"><h2>Kontakty</h2></div>
                    <div className="row d-flex flex-row justify-content-evenly align-items-center my-2">
                        <div className={classes["contact-container"] + " d-flex align-items-center my-3"}>
                            <div className={classes["icon-container"] + " position-relative mx-5"}>
                                <Image src="/img/icons/phone.png" alt="Fotka školky" layout="fill" />
                            </div><span className={classes["link"]}>{contactText.tel}</span>
                        </div>
                        <div className={classes["contact-container"] + " d-flex align-items-center"}>
                            <div className={classes["icon-container"] + " position-relative mx-5"}>
                                <Image src="/img/icons/mail.png" alt="Fotka školky" layout="fill" />
                            </div><span className=""><a href={"mailto:" + contactText.email}>{contactText.email}</a></span>
                        </div>
                    </div>
                    <div className="row d-flex flex-row justify-content-between align-items-start my-2">
                        <div className="w-fit-content my-2">
                            <ul aria-label="Adresa školky" className={classes["left-items"] + " " + classes["with-title"]}>
                                <li>Mateřská školka Stražisko,</li>
                                <li>příspěvková organizace,</li>
                                <li>Stažisko 25,</li>
                                <li>798 44 Stražisko</li>
                            </ul>
                        </div>
                        <div className="w-fit-content my-2">
                            <ul aria-label="Kontaktní údaje na pověřence (JJP GDPR group s.r.o.)" className={classes["left-items"] + " " + classes["with-title"]}>
                                <li>Sídlo: Úvoz 508/5, Staré Brno, 602 00  Brno,</li>
                                <li>IČ: 06615201 ,</li>
                                <li>Pověřenec: Jaroslav Jordán ,</li>
                                <li>Mobil: 777 722 720,</li>
                                <li>E-mail: <a href="mailto:poverenec@jjpgroup.cz">poverenec@jjpgroup.cz</a></li>
                            </ul>
                        </div>
                        <div className="w-fit-content my-2">
                            <ul aria-label="Zajímavé odkazy" className={classes["right-items"] + " " + classes["with-title"]}>
                                <li><Link href="/admin">Administrace</Link></li>
                                <li><Link href="/pristupnost">Informace o přístupnosti</Link></li>
                                <li><Link href="/">Informace o zpracování osobních údajů</Link></li>
                                {/* <li><Link href="/"><a>Tvorba webových stránek</a></Link></li> */}
                            </ul>
                        </div>
                    </div>
                    <div className={classes["copyright"] + " row my-2"}><span>Copyright © 2021{new Date().getFullYear() > 2021 ? " - " + new Date().getFullYear() : ""} <Link href="/">Petr Marek</Link>. Všechna práva vyhrazena.</span></div>
                </div>
            </div>
        </div>
    );
}

export default Footer;

