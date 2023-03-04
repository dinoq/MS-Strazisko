import { Provider } from "react-redux";

export default (Component, store) => {
    return (props)=>{
        return (
            <Provider store={store}>
                <Component {...props} />
            </Provider>
        )
    }
}