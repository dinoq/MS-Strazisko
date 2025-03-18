
import { NextPage } from "next";
import AdminPage from "../../../components/admin/AdminPageLayout/AdminPage";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "../../../helpers/sessionConfig";

const PhotosPage: NextPage = (props: any) => {
    return (
        <AdminPage formID="PublicPhoto" />
    )
}

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean | undefined = (session as any).adminLogged;

    if (adminLogged
    ) {
        return {
            props: {},
        };
    } else {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            }
        };
    }
}

export default PhotosPage;