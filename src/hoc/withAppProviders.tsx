import { Provider } from "react-redux";
import store from "../store/index";

const withAppProviders = (Component) => {
    // eslint-disable-next-line react/display-name
    return (props) => {
        return (
            <>
                {/*<Provider>*/}
                <Provider store={store}>
                    <Component {...props} />
                </Provider>
                {/*</Provider>*/}
            </>
        )
    }
}

export default withAppProviders;