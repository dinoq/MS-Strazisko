import '../styles/globals.css'
import type { AppProps } from 'next/app'
import MainLayout from "../components/MainLayout/MainLayout";
import "../components/MainLayout/MainLayout.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <><MainLayout>
      <Component {...pageProps} />

      </MainLayout>
    {/*<Component {...pageProps} />*/}
    </>
  )
}
export default MyApp
