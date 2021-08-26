import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import SchoolFeature from '../components/SchoolFeature'

import classes from "/styles/index.module.scss"

import toys from "../public/img/toys.webp"
import playIcon from "../public/img/play-icon-optimal.svg"
import treeIcon from "../public/img/tree-icon-optimal.svg"
import foodIcon from "../public/img/food-icon-optimal.svg"
import smileIcon from "../public/img/smile-icon-optimal.svg"
import Teacher from '../components/Teacher'
import EventCard from '../components/EventCard'

export default function Home() {
  const a = "/navrh/unused/camping.jpg";
  const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
  ];

  let
    features: Array<{ icon: any, bgColor: string, alt: string, title: string, description: string }>,
    teachers: Array<{ imgSrc: string, name: string, description: string }>,
    events: Array<{ imgSrc: string, title: string, date: string, description: string }>;

  features = [
    { icon: playIcon, bgColor: "#0a58ca", alt: "Ikona herní konzole", title: "Zábava", description: "Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví." },
    { icon: treeIcon, bgColor: "#0aca10", alt: "Ikona přírody", title: "Krásná příroda", description: "Školka se nachází uprostřed krásné přírody." },
    { icon: foodIcon, bgColor: "#ca3f0a", alt: "Ikona jídla (ovoce)", title: "Stravování", description: "Každý den jsou do školy dováženy obědy z nedaleké MŠ Ptení." },
    { icon: smileIcon, bgColor: "#dbc506", alt: "Ikona úsměvu", title: "Příjemná atmosféra", description: "Vaše děti se u nás budou cítit jako doma." },
  ]

  teachers = [
    { imgSrc: "/img/photo.jpg", name: "Mgr. Iveta Marková", description: "Ředitelka školky" },
    { imgSrc: "/img/photo.jpg", name: "Bc. Iveta Nováková", description: "Učitelka" },
    { imgSrc: "/img/photo.jpg", name: "Iveta Marková", description: "Učitelka" },
  ]

  events = [
    { imgSrc: "/navrh/unused/camping.jpg", title: "Schůzky", date: "19. 8. 2020", description: "<span style='color: red'>Ve čtvrtek 24.6</span> v 16:00 hodin se budou konat schůzky rodičů s pracovnicemi MŠ a se zřizovatelem MŠ. Prosím o aktivní účast VŠECH rodičů bez dětí." },
    { imgSrc: "/navrh/unused/camping.jpg", title: "Schůzky", date: "19. 8. 2020", description: "<span style='color: red'>Ve čtvrtek 24.6</span> v 16:00 hodin se budou konat schůzky rodičů s pracovnicemi MŠ a se zřizovatelem MŠ. Prosím o aktivní účast VŠECH rodičů bez dětí." },
  ]
  return (
    <>
      <Head>
        <title>MŠ stražisko</title>
        <meta name="description" content="Stránky Mateřské školky Stražisko" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container-fluid">
          {/*
          <div className="row mb-4">
            <div className={classes.hero + " col-12"}>
            </div>
          </div> */}

          <div className={classes.about + " row my-4 justify-content-center align-items-center"}>
            <div className="d-none d-lg-block col-lg-4 position-relative">
              <Image src={toys} layout="responsive" sizes="33vw" alt="Hračky" placeholder="blur" id={classes["toys-img"]} />
            </div>
            <div className="col-10 col-lg-4">
              <h1 className="fw-bold">O naší mateřské školce</h1>
              <p>
                Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopené lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy.
              </p>
            </div>
          </div>

          <div className={classes["school-features"] + " row my-4 text-white text-center justify-content-center"}>
            <div className="col-10 p-4 d-flex flex-column justify-content-center">
              <div className="row"><h2>Zázemí</h2></div>
              <div className="row">
                {features.map((feature, index) =>
                  <div key={"feature-" + index} className="col-6 col-md-3">
                    <SchoolFeature icon={feature.icon} bgColor={feature.bgColor} alt={feature.alt} title={feature.title} description={feature.description} />
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className={classes["teachers"] + " row my-4 mb-5 justify-content-center text-center"}>
            <div className="col-10 d-flex flex-column justify-content-center">
              <div className="row"><h2>Učitelé</h2></div>
              <div className="row w-100 justify-content-between">
                {teachers.map((teacher, index) =>
                  <div key={"teacher-" + index} className="col-12 col-md-6 col-lg-3 mt-2 mb-5">
                    <Teacher imgSrc={teacher.imgSrc} name={teacher.name} description={teacher.description} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={classes["events"] + " row my-4  text-center text-blue align-items-center justify-content-center"}>
            <div className="col-10 p-4 d-flex flex-column justify-content-center">
              <div className="row"><h2>Nadcházející události</h2></div>
              <div className="row justify-content-center">
                {events && events.map((event, index) =>
                  <div key={"event-" + index} className="col-12 col-md-8 col-lg-6">
                    <EventCard imgSrc={event.imgSrc} title={event.title} date={event.date} description={event.description} />
                  </div>
                )}
                {!events &&
                  <div>Je nám líto, ale žádné nadcházející události nebyly nalezeny!</div>
                }
              </div>
            </div>
          </div>
        </div>

        <div className={classes["gallery"] + " row my-4 justify-content-center text-center"}>
          <div className="col-10">
            <div className="row"><h2>Foto školy</h2></div>
            <div className="h5">(Pro více fotek přejděte z menu na <Link href="/foto"><a>Foto</a></Link>)</div>
            <div className={classes["gallery-container"] + " row justify-content-center"}>
              {images.map((img, index) =>
                <div key={"img-thumbnail-" + index} className={classes["image-frame"] + " col-4"}>
                  <div className={classes["image-container"] + " position-relative"}>
                    <Image src={img.thumbnail} alt="Fotka školky" layout="fill" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={classes["enrollment"] + " row my-4 justify-content-center text-center text-white"}>
          <div className="col-10 p-4 d-flex flex-column justify-content-center">
            <div className="row"><h2>Chcete svoje dítě přihlásit do naší MŠ?</h2></div>
            <div className="row mt-4 justify-content-center align-items-center">
              <button>Informace k přihláškám</button>
              <div className={classes["pen-image-container"] + " position-relative"}>
                <Image src="/img/pen.png" alt="Fotka školky" layout="fill" />
              </div>
            </div>
          </div>
        </div>

        <div className={classes["map"] + " row my-4 justify-content-center text-center"}>
          <div className="col-10">
            <div className="row"><h2>Jak se k nám dostanete?</h2></div>
            <div className={" row"}>
              <div className={classes["mapouter"]}>
                <div className={classes["gmap_canvas"]}>
                  <iframe width="800" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=M%C5%A0%20Stra%C5%BEisko&t=&z=13&ie=UTF8&iwloc=&output=embed" scrolling="no"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classes["footer"] + " row my-4 justify-content-center text-center text-white"}>
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
                  <li>Mateřská školka Stražisko</li>
                  <li>příspěvková organizace,</li>
                  <li>798 44 Stražisko</li>
                </ul>
              </div>
              <div className="w-fit-content my-2">
                <ul className={classes["right-items"]}>
                  <li><Link href="/"><a>Informace o přístupnosti</a></Link></li>
                  <li><Link href="/"><a>Informace o zpracování osobních údajů</a></Link></li>
                  <li><Link href="/"><a>Levné webové stránky</a></Link></li>
                </ul>
              </div>
            </div>
            <div className={classes["copyright"] + " row"}><span>Copyright © 2021{new Date().getFullYear() > 2021 ? " - " + new Date().getFullYear() : ""} <Link href="/"><a>Petr Marek</a></Link>. Všechna práva vyhrazena.</span></div>
          </div>
        </div>


      </main>
    </>
  )
}
