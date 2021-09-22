
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import MainLayout from "../components/MainLayout/MainLayout"
import "../styles/adminStyles.scss"
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname === "/404") { // not index
    return (
      <div className="layout">
        <Header noBackground={true} />
        <Component {...pageProps} />
      </div>
    )

  }

  if (router.pathname.includes("admin")) {
    if(router.pathname.includes("login")){
      return (
        <div className="admin">
          <Component {...pageProps} />
        </div>
      )
    }else{
      return (
        <div className="admin">
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </div>
      )
    }
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
