
import '../../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import AdminPageLayout from "../components/admin/AdminPageLayout/AdminPageLayout"
import "../../styles/adminStyles.scss"
import { useRouter } from 'next/router';
import { Provider, useDispatch, useSelector } from "react-redux"
import { RootState } from '../types';
import store from "../store";
import { SagaActions } from '../store/sagas';
import { useEffect } from 'react';

function MyAppWrapper({ Component, pageProps }) {

    return (
        <Provider store={store}>
            <MyApp>
                <Component {...pageProps} />
            </MyApp>
        </Provider>
    )
}

function MyApp(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const definitions = useSelector((state: RootState) => state.formDefinitions);

    useEffect(() => {
        if (!definitions.definitionsLoaded) {
            //store.dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: "albumPasswords" })
        }
    }, [])
    if (router.pathname === "/404") { // not index
        return (
            <div className="layout">
                <Header noBackground={true} />
                {props.children}
            </div>
        )
    }

    if (router.pathname.includes("admin")) {
        if (router.pathname.includes("login")) {
            return (
                <div className="admin">
                    {props.children}
                </div>
            )
        } else {
            return (
                <div className="admin">
                    <AdminPageLayout>
                        {props.children}
                    </AdminPageLayout>
                </div>
            )
        }
    }

    return (
        <div className="layout">
            <Header />
            {props.children}
            <Footer />
        </div>
    )
}

export default MyAppWrapper;
