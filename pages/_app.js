
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if(router.pathname !== "/"){ // not index
    return (
      <><div className="ASDF">
        <Header />
        <Component {...pageProps} /></div>
      </>
    )

  }

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
