import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import SchoolFeature from '../../src/components/school-feature/SchoolFeature'

import classes from "../../styles/index.module.scss"

import toys from "../../public/img/toys.webp"
import Teacher from '../../src/components/teacher/Teacher'
import EventCard from '../../src/components/event-card/EventCard'
import { useEffect, useState } from 'react'
import { DBManager } from '../helpers/DBManager'

export default function Home(props) {
    const a = "/navrh/unused/camping.jpg";

    const [introText, setIntroText]: [{ title: string, content: string }, any] = useState({ title: "", content: "" });

    const [features, setFeatures]: [Array<{ icon: any, bgColor: string, alt: string, title: string, description: string }>, any] = useState([]);
    const [teachers, setTeachers]: [Array<{ imgSrc: string, name: string, job: string }>, any] = useState([]);
    const [events, setEvents]: [Array<{ imgSrc: string, title: string, date: string, description: string }>, any] = useState([]);
    const [publicImages, setPublicImages]: [Array<{ original: string, thumbnail: string }>, any] = useState([]);

    /*
      teachers = [
        { imgSrc: "/img/photo.jpg", name: "Mgr. Eva Výmolová", job: "Ředitelka školky" },
        { imgSrc: "/img/photo.jpg", name: "Iveta Marková", job: "Zastupující ředitelka za MD" },
        { imgSrc: "/img/photo.jpg", name: "Andrea Dedková", job: "Učitelka" },
        { imgSrc: "/img/photo.jpg", name: "Petra Kozáková", job: "Školnice, Výdej stravy" },
      ]*/
    /*
      events = [
        { imgSrc: "/navrh/unused/camping.jpg", title: "Schůzky", date: "19. 8. 2020", description: "<span style='color: red'>Ve čtvrtek 24.6</span> v 16:00 hodin se budou konat schůzky rodičů s pracovnicemi MŠ a se zřizovatelem MŠ. Prosím o aktivní účast VŠECH rodičů bez dětí." },
        { imgSrc: "/navrh/unused/camping.jpg", title: "Schůzky", date: "19. 8. 2020", description: "<span style='color: red'>Ve čtvrtek 24.6</span> v 16:00 hodin se budou konat schůzky rodičů s pracovnicemi MŠ a se zřizovatelem MŠ. Prosím o aktivní účast VŠECH rodičů bez dětí." },
      ]*/

    useEffect(() => {
        fetch("/api/data?table=events;teachers;public_images;intro").then((data) => {
            data.json().then(json => {
                setEvents(json.events.map((event) => {
                    return { imgSrc: (event.img_url ? "/img/albums/other/event-photos/" + event.img_url : "/img/albums/other/no-photo.jpg"), title: event.title, date: new Date(event.date).toLocaleDateString("cs-CZ", { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' }), description: event.description }
                }));

                setTeachers(json.teachers.map((teacher) => {
                    return { imgSrc: (teacher.filename ? "/img/albums/other/teacher-photos/" + teacher.filename : "/img/albums/other/photo.jpg"), name: teacher.name, job: teacher.job }
                }))

                setPublicImages(json.public_images.map((publicImage) => {
                    return { original: "/img/albums/other/public-photos/" + publicImage.filename, thumbnail: "/img/albums/other/public-photos/" + publicImage.filename + "?minify=true" }
                }))

                setIntroText({
                    title: json.intro[0].title,
                    content: DBManager.substituteTags(json.intro[0].content, true)
                });                
            })
        })
        setFeatures([
            { icon: "/img/play-icon-optimal.svg", bgColor: "#0a58ca", alt: "Ikona herní konzole", title: "Zábava", description: "Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví." },
            { icon: "/img/tree-icon-optimal.svg", bgColor: "#0aca10", alt: "Ikona přírody", title: "Krásná příroda", description: "Školka se nachází uprostřed krásné přírody." },
            { icon: "/img/food-icon-optimal.svg", bgColor: "#ca3f0a", alt: "Ikona jídla (ovoce)", title: "Stravování", description: "Každý den jsou do školy dováženy obědy z nedaleké MŠ Ptení." },
            { icon: "/img/smile-icon-optimal.svg", bgColor: "#dbc506", alt: "Ikona úsměvu", title: "Příjemná atmosféra", description: "Vaše děti se u nás budou cítit jako doma." },
        ])
        /*
                setPublicImages([
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
                ])*/
    }, [])
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
                            <h1 className="fw-bold">{introText.title}</h1>
                            <p dangerouslySetInnerHTML={{__html: introText.content}}></p>
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
                            <div className="row"><h2>Personál MŠ</h2></div>
                            <div className="row w-100 justify-content-center justify-content-lg-evenly">
                                {teachers.map((teacher, index) => {
                                    return (
                                        <div key={"teacher-" + index} className="col-12 col-md-6 col-lg-3 mt-5 mt-lg-2 mb-5">
                                            <Teacher imgSrc={teacher.imgSrc} name={teacher.name} description={teacher.job} />
                                        </div>
                                    )
                                }
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
                                {(!events || events.length == 0) &&
                                    <div className="my-3">Je nám líto, ale žádné nadcházející události nebyly nalezeny...</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className={classes["gallery"] + " row my-4 justify-content-center text-center"}>
                        <div className="col-10">
                            <div className="row"><h2>Foto školy</h2></div>
                            <div className="h5">(Pro více fotek přejděte z menu na <Link href="/foto"><a>Foto</a></Link>)</div>
                            <div className={classes["gallery-container"] + " row justify-content-center"}>
                                {publicImages.map((img, index) => {
                                    let col = (publicImages.length % 4 == 0)? "col-3" : "col-4";
                                    
                                    return (
                                        <div className={"d-flex justify-content-center " + col}>
                                        <div key={"img-thumbnail-" + index} className={classes["image-frame"] + " " + col}>
                                            <div className={classes["image-container"] + " position-relative"}>
                                                <Image src={img.thumbnail} alt="Fotka školky" layout="fill" objectFit='contain'/>
                                            </div>
                                        </div>
                                            </div>
                                            
                                    )
                                }
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={classes["enrollment"] + " row my-4 justify-content-center text-center text-white"}>
                        <div className="col-10 p-4 d-flex flex-column justify-content-center">
                            <div className="row"><h2>Chcete svoje dítě přihlásit do naší MŠ?</h2></div>
                            <div className="row mt-4 justify-content-center align-items-center">
                                <Link href="/dokumenty"><a><button>Informace k přihláškám</button></a></Link>
                                <div className={classes["pen-image-container"] + " position-relative d-none d-sm-block"}>
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
                                        {/* <iframe width="800" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=M%C5%A0%20Stra%C5%BEisko&t=&z=13&ie=UTF8&iwloc=&output=embed" scrolling="no"></iframe> */}
                                        <div style={{ width: "100%" }}><iframe width="100%" height="600" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=M%C5%A1%20stra%C5%BEisko%2025+(M%C5%A0%20Stra%C5%BEisko)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/truck-gps/">transport gps</a></iframe></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}