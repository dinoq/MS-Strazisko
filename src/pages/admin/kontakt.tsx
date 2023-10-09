import type { NextPage } from 'next'
import { withIronSessionSsr } from "iron-session/next";
import AdminPage from '../../components/admin/AdminPageLayout/AdminPage';

const AdminContactsPage: NextPage = (props: any) => {
    return (
        <AdminPage formID="ContactText" />
    )
}

export const getServerSideProps = withIronSessionSsr(
    async ({ req, res }) => {
        const adminLogged: boolean | undefined = req.session.adminLogged;

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
    },
    {
        cookieName: "myapp_cookiename",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false,
        },
        password: "P5hBP4iHlvp6obqtWK0mNuMrZow5x6DQV61W3EUG",
    }
);

export default AdminContactsPage;
