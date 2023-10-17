import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import FormDefReducer from "./formDefReducer";
import BreadcrumbReducer from "./reducers/BreadcrumbSlice";
import rootSaga from "./sagas";
import ErrorReducer from "./reducers/ErrorSlice";
import DBObjectReducer from "./reducers/DBObjectSlice";
import EntriesReducer from "./reducers/EntrySlice"

let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        breadcrumb: BreadcrumbReducer,
        forms: FormDefReducer,
        errorReducers: ErrorReducer,
        dbObject: DBObjectReducer,
        entries: EntriesReducer
    },
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch

export default store;