import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import FormDefReducer from "../../database/definitions/FormDefReducer";
import BreadcrumbReducer from "../components/admin/Breadcrumb/BreadcrumbReducer";
import rootSaga from "./sagas";

let sagaMiddleware = createSagaMiddleware();
//const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
    reducer: {
        breadcrumb: BreadcrumbReducer,
        formDefinitions: FormDefReducer
    },
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(rootSaga);

//export const action = type => store.dispatch({ type });
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() 

export default store;