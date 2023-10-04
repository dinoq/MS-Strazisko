
import '../../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import AdminPageLayout from "../components/admin/AdminPageLayout/AdminPageLayout"
import "../../styles/adminStyles.scss"
import { useRouter } from 'next/router';
import { Provider, useSelector } from "react-redux";
import { RootState } from '../helpers/types';
import store from "../store";
import withPageStoreProvider from '../hoc/withStoreProvider';
import { AppProps } from 'next/app';


function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const definitions = useSelector((state: RootState) => state.formDefinitions);

    if (router.pathname === "/404") { // not index
        return (
            <div className="layout">
                <Header noBackground={true} />
                <Component {...pageProps} />
            </div>
        )
    }

    if (router.pathname.includes("admin")) {
        if (router.pathname.includes("login")) {
            return (
                <div className="admin">
                    <Component {...pageProps} />
                </div>
            )
        } else {
            return (
                <div className="admin">
                    <AdminPageLayout>
                    <Component {...pageProps} />
                    </AdminPageLayout>
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

export default withPageStoreProvider(MyApp, store);

