import { NextPage } from "next";
import { useEffect } from "react";
import useAppDispatch from "../hooks/useAppDispatch";
import { SagaActions } from "../store/sagas";

export default (Page: NextPage, formID: string) => {    

    console.log("CCC");
    return (props) => {  
        console.log("BBBB");
        const dispatch = useAppDispatch();
    
        useEffect(() => {
            dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: formID });
        }, [dispatch])

        return <Page {...props} />;
    }

}