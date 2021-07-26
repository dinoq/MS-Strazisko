import Head from 'next/head'
import Image from 'next/image'
import Container8 from '../components/UI/Container8'
import classes from "/styles/index.module.css"

export default function Home() {
  return (
    <div className={classes.container}>
      <Head>
        <title>MŠ stražisko</title>
        <meta name="description" content="Stránky Mateřské školky Stražisko" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
      <div className="row">
                <div className={classes.hero + " col-12"}>
                    
                </div>
            </div>
            <div className="row pt-4">
                <Container8>
                    <div className="row">
                        <div className="col-4 position-relative">
                          <Image src="/img/toys.jpg" layout="fill" alt="Hračky"/>
                        </div>
                        <div className="col-8">
                            <h1>O MŠ Stražisko</h1>
                            <p>
                            Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopené lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy. Mateřská školka se nachází v malé vesničce Stražisko na Konicku uprostřed malebné přírody, obklopená lesy. 
                            </p>
                        </div>
                    </div>
                </Container8>
            </div>





      </main>
    </div>
  )
}
