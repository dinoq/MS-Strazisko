import { call, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { loadFormDef, setActualFormDef } from './formDefReducer';
import { DBManager } from '../features/data/lib/DBManager';
import { FormDefinitionsState, RootState } from '../FilesToDistribute/types';

export enum SagaActions {
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}

function* setFormDefinitions(action){
    try {
        let formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.forms);
        if(!formDefinitions.definitionsLoaded){
            const definitions = yield call(DBManager.fetchFormDefinitions);
            yield putResolve(loadFormDef(definitions))    
        }
        formDefinitions = yield select((state: RootState)=>state.forms);
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