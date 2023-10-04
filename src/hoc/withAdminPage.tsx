import { NextPage } from "next";
import { useEffect } from "react";
import useAppDispatch from "../hooks/useAppDispatch";
import { SagaActions } from "../store/sagas";

const withAdminPage = (Page: NextPage, formID: string) => {    
    // eslint-disable-next-line react/display-name
    return (props: any) => {  
        const dispatch = useAppDispatch();
    
        useEffect(() => {
            dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: formID });
        }, [dispatch])

        return <Page {...props} />;
    }

}

withAdminPage.displayName = "awithAdminPage";

export default withAdminPage;