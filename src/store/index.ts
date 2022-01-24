import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import FormDefReducer from "./reducers/FormDefReducer";
import BreadcrumbReducer from "./reducers/BreadcrumbReducer";
import otherReducers from "./reducers/otherReducers";
import rootSaga from "./sagas";
import ErrorReducer from "./reducers/ErrorReducer";
import DBObjectReducer from "./reducers/DBObjectReducer";

let sagaMiddleware = createSagaMiddleware();
//const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
    reducer: {
        breadcrumb: BreadcrumbReducer,
        formDefinitions: FormDefReducer,
        errorReducers: ErrorReducer,
        dbObject: DBObjectReducer,
        otherReducers: otherReducers
    },
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(rootSaga);

//export const action = type => store.dispatch({ type });
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() 

export default store;