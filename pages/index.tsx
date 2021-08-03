import Head from 'next/head'
import Image from 'next/image'
import SchoolFeature from '../components/SchoolFeature'

import classes from "/styles/index.module.scss"

import toys from "../public/img/toys.webp"
import playIcon from "../public/img/play-icon-optimal.svg"
import treeIcon from "../public/img/tree-icon-optimal.svg"
import foodIcon from "../public/img/food-icon-optimal.svg"
import smileIcon from "../public/img/smile-icon-optimal.svg"

export default function Home() {
  return (
    <>
      <Head>
        <title>MŠ stražisko</title>
        <meta name="description" content="Stránky Mateřské školky Stražisko" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container-fluid">

          <div className="row pb-3">
            <div className={classes.hero + " col-12"}>

            </div>
          </div>
          <div className={"row my-3 justify-content-center align-items-center " + classes.about}>
            <div className="d-none d-lg-block col-lg-4 position-relative">
              <Image src={toys} layout="responsive" sizes="33vw" alt="Hračky" placeholder="blur" id={classes["toys-img"]} />
            </div>
            <div className="col-10 col-lg-4">
              <h1 className="fw-bold">O MŠ Stražisko</h1>
              <p>
                Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopené lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy.
              </p>
            </div>
          </div>
          <div className={classes["school-features"] + " row py-3 text-white text-center justify-content-center"}>
            <div className="col-10">
              <div className="row"><h2>Zázemí</h2></div>
              <div className="row">
                <SchoolFeature icon={playIcon} bgColor="#0a58ca" alt="Ikona herní konzole" title="Zábava" description="Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví." />
                <SchoolFeature icon={treeIcon} bgColor="#0aca10" alt="Ikona přírody" title="Krásná příroda" description="Školka se nachází uprostřed krásné přírody." />
                <SchoolFeature icon={foodIcon} bgColor="#ca3f0a" alt="Ikona jídla (ovoce)" title="Stravování" description="Každý den jsou do školy dováženy obědy z nedaleké MŠ Ptení." />
                <SchoolFeature icon={smileIcon} bgColor="#dbc506" alt="Ikona úsměvu" title="Příjemná atmosféra" description="Vaše děti se u nás budou cítit jako doma." /></div>
              

            </div>

          </div>


          {/* <div className={classes["teachers"] + " row py-4"}>

          </div>
          <div className={classes["events"] + " row py-4"}>

          </div> */}





        </div>
      </main>
    </>
  )
}
