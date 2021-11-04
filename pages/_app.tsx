
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import MainLayout from "../components/MainLayout/MainLayout"
import "../styles/adminStyles.scss"
import { useRouter } from 'next/router';
import { Provider } from "react-redux"
import { configureStore } from '@reduxjs/toolkit';
import BreadcrumbReducer, { BreadcrumbState } from '../components/admin/Breadcrumb/BreadcrumbReducer';
import { FormDef } from '../src/types';
import FormDefReducer from '../database/definitions/FormDefReducer';

export interface ReducerStates {
    breadcrumb: BreadcrumbState,
    def: FormDef
}

const store = configureStore({
    reducer: {breadcrumb: BreadcrumbReducer, def: FormDefReducer}
})

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
        if (router.pathname.includes("login")) {
            return (
                <Provider store={store}>
                    <div className="admin">
                        <Component {...pageProps} />
                    </div>
                </Provider>
            )
        } else {
            return (
                <Provider store={store}>
                    <div className="admin">
                        <MainLayout>
                            <Component {...pageProps} />
                        </MainLayout>
                    </div>
                </Provider>
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
