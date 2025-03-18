
import type { NextPage } from 'next';
import { cookies } from 'next/headers';
import AdminPage from "../../components/admin/AdminPageLayout/AdminPage";
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../helpers/sessionConfig';

const AdminFoodPage: NextPage = (props: any) => {
    return (
        <AdminPage formID="Food" />
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

export default AdminFoodPage;
