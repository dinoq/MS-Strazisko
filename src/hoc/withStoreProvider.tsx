import { Provider } from "react-redux";

const withStoreProvider = (Component, store) => {
    // eslint-disable-next-line react/display-name
    return (props)=>{
        return (
            <Provider store={store}>
                <Component {...props} />
            </Provider>
        )
    }
}

export default withStoreProvider;