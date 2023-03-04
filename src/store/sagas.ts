import { call, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { loadFormDef, setActualFormDef } from './reducers/FormDefSlice';
import { DBManager } from '../helpers/DBManager';
import { FormDefinitionsState, RootState } from '../helpers/types';

export enum SagaActions {
    LOAD_FORM_DEFINITIONS = "LOAD_FORM_DEFINITIONS",
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}


function* setFormDefinitions(action){
    try {
        console.log("AAAAAAAAAAAAAAAAAAA");
        let formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(!formDefinitions.definitionsLoaded){
            const definitions = yield call(DBManager.fetchFormDefinitions);
            yield putResolve(loadFormDef(definitions))    
        }
        formDefinitions = yield select((state: RootState)=>state.formDefinitions);
        if(formDefinitions.definitions[action.FID]){
            yield put(setActualFormDef(action.FID))   
        }     
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* rootSaga(){
    yield takeLatest(SagaActions.SET_FORM_DEFINITIONS, setFormDefinitions);
}

export default rootSaga;