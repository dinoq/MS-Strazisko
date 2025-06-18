"use client"

import { FC, useEffect, useState } from "react";
import useAppDispatch from "@hooks/useAppDispatch";
import useSelector from "@hooks/useAppSelector";
import { RootState } from "../../../../FilesToDistribute/types";
import Head from "next/head";
import FormFrameContainer from "../FormFrame/FormFrameContainer";
import { selectActualFormDefinition } from "@store/formDefReducer/selector";
import { SagaActions } from "@store/sagaActions";
/*
type AdminPageProps = {
    formID: string
}

const FormPage: FC<any> = ({
    formID
}) =>{
    // eslint-disable-next-line react/display-name
        const dispatch = useAppDispatch();
        const [pageFormDefinitionLoaded, setPageFormDefinitionLoaded] = useState(false);
        const DBOClass = useSelector((state: RootState) => selectActualFormDefinition(state).DB?.DBOClass);

        useEffect(() => {
            dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: formID });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dispatch])

        useEffect(() => {
            setPageFormDefinitionLoaded(true)
        }, [DBOClass])

        return (

            <div className={""}>

                <main className={""}>
                    {pageFormDefinitionLoaded && <FormFrameContainer />}
                </main>
            </div>
        )
}


export default FormPage;*/