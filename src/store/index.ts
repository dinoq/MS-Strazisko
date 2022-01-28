import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import FormDefReducer from "./reducers/FormDefReducer";
import BreadcrumbReducer from "./reducers/BreadcrumbReducer";
import otherReducers from "./reducers/otherReducers";
import rootSaga from "./sagas";
import ErrorReducer from "./reducers/ErrorReducer";
import DBObjectReducer from "./reducers/DBObjectReducer";
import EntriesReducer from "./reducers/EntryReducer"

let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        breadcrumb: BreadcrumbReducer,
        formDefinitions: FormDefReducer,
        errorReducers: ErrorReducer,
        dbObject: DBObjectReducer,
        entries: EntriesReducer
    },
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() 

export default store;