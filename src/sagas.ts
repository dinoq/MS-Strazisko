import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { loadFormDef, setActualFormDef } from '../database/definitions/FormDefReducer';
import { DBManager } from './DBManager';
import { ReducerStates } from './types';



export enum SagaActions {
    LOAD_FORM_DEFINITIONS = "LOAD_FORM_DEFINITIONS",
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}


function* loadFormDefinitions(){
    try {
        const definitions = yield call(DBManager.fetchFormDefinitions);
        yield put(loadFormDef(definitions))        
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* setFormDefinitions(action){
    console.log('action: ', action);
    try {
        const definitionsLoaded = yield select((state: ReducerStates)=>state.formDefinitions.definitionsLoaded);
        if(!definitionsLoaded){
            console.log("NOT LOADEED DEFS!!!");
            yield call(loadFormDefinitions);
            console.log("NOT LOADEED DEFS!!!");
        }
        yield put(setActualFormDef(action.FID))        
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* mySaga(){
    yield takeLatest(SagaActions.LOAD_FORM_DEFINITIONS, loadFormDefinitions);
    yield takeLatest(SagaActions.SET_FORM_DEFINITIONS, setFormDefinitions);
}

export default mySaga;