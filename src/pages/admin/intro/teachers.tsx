
import { NextPage } from "next";
import AdminPage from "../../../features/admin/components/AdminPageLayout/AdminPage";
import { sessionOptions } from "../../../features/auth/sessionConfig";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

const TeacherPage: NextPage = (props: any) => {
    return (
        <AdminPage formID="Teacher" />
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

export default TeacherPage;