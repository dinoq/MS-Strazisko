import Admin from "@features/admin/page/admin";

const AdminPage = () => {

        return <Admin />
}

export default AdminPage;
/*

const styles: any = {};
const AdminHomePage: NextPage = (props: any) => {
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

export default AdminHomePage;

*/