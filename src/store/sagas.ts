import { useDispatch } from 'react-redux';
import { all, call, fork, put, putResolve, select, takeEvery, takeLatest,takeLeading } from 'redux-saga/effects'
import { loadFormDef, setActualFormDef } from './reducers/FormDefReducer';
import { DBManager } from '../DBManager';
import { FormDefinitionsState, RootState } from '../types';

export enum SagaActions {
    LOAD_FORM_DEFINITIONS = "LOAD_FORM_DEFINITIONS",
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}


function* setFormDefinitions(action){
    try {
        let formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(!formDefinitions.definitionsLoaded){
            const definitions = yield call(DBManager.fetchFormDefinitions);
            yield putResolve(loadFormDef(definitions))    
        }
        formDefinitions = yield select((state: RootState)=>state.formDefinitions);
        console.log('formDefinitions.definitions[action.FID]: ', action.FID, formDefinitions.definitions[action.FID]);
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