import Head from 'next/head'
import Image from 'next/image'
import Container8 from '../components/UI/Container8'
import SchoolFeature from '../components/SchoolFeature'

import classes from "/styles/index.module.scss"

import toys from "../public/img/toys.webp"
import playIcon from "../public/img/play-icon-optimal.svg"
import treeIcon from "../public/img/tree-icon-optimal.svg"
import foodIcon from "../public/img/food-icon-optimal.svg"
import smileIcon from "../public/img/smile-icon-optimal.svg"

export default function Home() {
  return (
    <div className={classes.container}>
      <Head>
        <title>MŠ stražisko</title>
        <meta name="description" content="Stránky Mateřské školky Stražisko" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <div className="row pb-3">
          <div className={classes.hero + " col-12"}>

          </div>
        </div>
        <div className={"row py-3 " + classes.about}>
          <Container8>
            <div className="row">
              <div className="col-4 position-relative">
                <Image src={toys} layout="responsive" width={1599} height={1066} alt="Hračky" placeholder="blur" id={classes["toys-img"]} />
              </div>
              <div className="col-8">
                <h1 className="fw-bold">O MŠ Stražisko</h1>
                <p>
                  Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopené lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy.
                </p>
              </div>
            </div>
          </Container8>
        </div>
        <div className={classes["school-features"] + " row py-3 text-white text-center"}>
          <div className={"row justify-content-center"}>
            <div className="col-8 row">
              <div className="col">
                <h2>Zázemí</h2>
              </div>

            </div>
            <div className="col-8 row py-3">
              <SchoolFeature icon={playIcon} alt="Ikona herní konzole" title="Zábava" description="Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví." />
              <div className="col-3 d-flex flex-column">
                <Image src={treeIcon} />
                <h3 className={"my-2"}><u><strong>Krásná příroda</strong></u></h3>
                <p>Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví.</p>
              </div>
              <div className="col-3 d-flex flex-column">
                <Image src={foodIcon} />
                <h3 className={"my-2"}><u><strong>Stravování</strong></u></h3>
                <p>Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví.</p>
              </div>
              <div className="col-3 d-flex flex-column">
                <Image src={smileIcon} />
                <h3 className={"my-2"}><u><strong>Příjemná atmosféra</strong></u></h3>
                <p>Školka vlastní mnoho různých hraček, kterými se vaše děti zabaví.</p>
              </div>

            </div>

          </div>
        </div>

        <div className={classes["teachers"] + " row py-4"}>
          <Container8>

          </Container8>
        </div>
        <div className={classes["events"] + " row py-4"}>
          <Container8>

          </Container8>
        </div>





      </main>
    </div>
  )
}
