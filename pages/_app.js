
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  if(router.pathname === "/404"){ // not index
    return (
      <div className="layout">
        <Header noBackground={true}/>
        <Component {...pageProps} />
      </div>
    )

  }

  return (
    <div className="layout">
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export default MyApp
