
import '../../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import MainLayout from "../components/MainLayout/MainLayout"
import "../../styles/adminStyles.scss"
import { useRouter } from 'next/router';
import { Provider, useSelector } from "react-redux"
import { BreadcrumbState, FormDef, FormDefinitionsState, FormDefs, ReducerStates } from '../types';
import store from "../store";
import { SagaActions } from '../sagas';

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

    const router = useRouter();
    const definitions = useSelector((state: ReducerStates)  => state.formDefinitions);
    console.log('definitions1111: ', definitions.definitionsLoaded);
    if (router.pathname === "/404") { // not index
        return (
            <div className="layout">
                <Header noBackground={true} />
            {props.children}
            </div>
        )
    }

    if (router.pathname.includes("admin")) {
        if(!definitions.definitionsLoaded){
            store.dispatch({type: SagaActions.LOAD_FORM_DEFINITIONS})
            store.dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: "albumPasswords"})
        }
        if (router.pathname.includes("login")) {
            return (
                    <div className="admin">
                    {props.children}
                    </div>
            )
        } else {
            return (
                    <div className="admin">
                        <MainLayout>
            {props.children}
                        </MainLayout>
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
