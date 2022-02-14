// eslint-disable-next-line
import classes from "./Footer.module.scss";
import Image from 'next/image'
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const Footer: React.FC<{}> = (props) => {
  const footer = useRef<HTMLDivElement>();
  const router = useRouter();
    
  return (
    <div ref={footer} className={classes["footer"] + " pt-4 container-fluid "/* + offsetClass*/}>
      <div className={" row justify-content-center text-center text-white"}>
        <div className="col-10 p-4 d-flex flex-column justify-content-center">
          <div className="row"><h2>Kontakty</h2></div>
          <div className="row d-flex flex-row justify-content-around align-items-center">
            <div className={classes["contact-container"] + " d-flex align-items-center my-3"}>
              <div className={classes["icon-container"] + " position-relative mx-5"}>
                <Image src="/img/icons/phone.png" alt="Fotka školky" layout="fill" />
              </div><span className="">+420 728 426 363</span>
            </div>
            <div className={classes["contact-container"] + " d-flex align-items-center"}>
              <div className={classes["icon-container"] + " position-relative mx-5"}>
                <Image src="/img/icons/mail.png" alt="Fotka školky" layout="fill" />
              </div><span className="">msstrazisko@seznam.cz</span>
            </div>
          </div>
          <div className="row d-flex flex-row justify-content-between align-items-center">
            <div className="w-fit-content my-2">
              <ul className={classes["left-items"]}>
                <li>Mateřská školka Stražisko,</li>
                <li>příspěvková organizace,</li>
                <li>Stažisko 25,</li>
                <li>798 44 Stražisko</li>
              </ul>
            </div>
            <div className="w-fit-content my-2">
              <ul className={classes["right-items"]}>
                <li><Link href="/admin"><a>Administrace</a></Link></li>
                <li><Link href="/pristupnost"><a>Informace o přístupnosti</a></Link></li>
                <li><Link href="/"><a>Informace o zpracování osobních údajů</a></Link></li>
                {/* <li><Link href="/"><a>Tvorba webových stránek</a></Link></li> */}
              </ul>
            </div>
          </div>
          <div className={classes["copyright"] + " row"}><span>Copyright © 2021{new Date().getFullYear() > 2021 ? " - " + new Date().getFullYear() : ""} <Link href="/"><a>Petr Marek</a></Link>. Všechna práva vyhrazena.</span></div>
        </div>
      </div>
    </div>
  )
}

export default Footer;

