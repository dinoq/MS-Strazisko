import { useDispatch } from 'react-redux';
import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { loadFormDef, setActualFormDef } from '../../database/definitions/FormDefReducer';
import { DBManager } from '../DBManager';
import { FormDefinitionsState, RootState } from '../types';



export enum SagaActions {
    LOAD_FORM_DEFINITIONS = "LOAD_FORM_DEFINITIONS",
    SET_FORM_DEFINITIONS = "SET_FORM_DEFINITIONS",
}


function* loadFormDefinitions(){
    console.log('loadFormDefinitions saga worker');
    try {
        const formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(formDefinitions.definitionsLoaded)
            return;

        const definitions = yield call(DBManager.fetchFormDefinitions);
        console.log('GOING TO PUT DEFINITION');
        yield put(loadFormDef(definitions))        
        console.log("************");
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* setFormDefinitions(action){
    console.log('setFormDefinitions saga worker, action:', action);
    try {
        const formDefinitions: FormDefinitionsState = yield select((state: RootState)=>state.formDefinitions);
        if(!formDefinitions.definitionsLoaded){
            console.log("NOT LOADEED DEFS!!!");
            yield put({ type: SagaActions.LOAD_FORM_DEFINITIONS })        
            console.log("probably LOADEED DEFS!!!");
        }
        console.log("LOADEED dddddd!!!");
        if(formDefinitions.definitions[action.FID]){
            yield put(setActualFormDef(action.FID))   
        }     
    } catch (error) {
        console.log('error: ', error);        
    }
}

function* asd(){
    yield takeLatest(SagaActions.LOAD_FORM_DEFINITIONS, loadFormDefinitions);
}
function* qwe(){
    yield takeLatest(SagaActions.SET_FORM_DEFINITIONS, setFormDefinitions);
}

function* rootSaga(){
    yield fork(asd);
    yield fork(qwe);
    //yield takeLatest(SagaActions.LOAD_FORM_DEFINITIONS, loadFormDefinitions);
    /*yield all([
        asd(),
        qwe()
    ])*/
    //yield takeLatest(SagaActions.SET_FORM_DEFINITIONS, setFormDefinitions);
}

export default rootSaga;