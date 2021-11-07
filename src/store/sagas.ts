import { useDispatch } from 'react-redux';
import { all, call, fork, put, select, takeEvery, takeLatest,takeLeading } from 'redux-saga/effects'
import { loadFormDef, setActualFormDef } from '../../database/definitions/FormDefReducer';
import { DBManager } from '../DBManager';
import { FormDefinitionsState, RootState } from '../types';

export enum SagaActions {
    LOAD_FORM_DEFINITIONS = "LOAD_FORM_DEFINITIONS",
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}


function* loadFormDefinitions(){
    try {
        const formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(formDefinitions.definitionsLoaded)
            return;

        const definitions = yield call(DBManager.fetchFormDefinitions);
        yield put(loadFormDef(definitions))        
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* setFormDefinitions(action){
    try {
        const formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(!formDefinitions.definitionsLoaded){
            yield put({ type: SagaActions.LOAD_FORM_DEFINITIONS })        
        }
        if(formDefinitions.definitions[action.FID]){
            yield put(setActualFormDef(action.FID))   
        }     
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* asd(){
    yield takeLeading(SagaActions.LOAD_FORM_DEFINITIONS, loadFormDefinitions);
}
function* qwe(){
    yield takeLatest(SagaActions.SET_FORM_DEFINITIONS, setFormDefinitions);
}

function* rootSaga(){
    // yield fork(asd);
    // yield fork(qwe);
    yield all([
        asd(),
        qwe()
    ])
}

export default rootSaga;