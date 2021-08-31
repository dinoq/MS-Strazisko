
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer";

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  if(router.pathname === "/404"){ // not index
    return (
      <>
        <Header noBackground={true}/>
        <Component {...pageProps} />
      </>
    )

  }

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
