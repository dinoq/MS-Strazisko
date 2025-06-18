import AdminLogin from "@features/admin/page/login";
import authOptions from "@features/auth/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


const AdminLoginPage = async () => {
    const session = await getServerSession(authOptions);
  
    if (session) {
        redirect("./intro")
    }

    return <AdminLogin />

    

/*
export const getServerSideProps = async (context) => {
    const { req, res } = context;
    const session = await getIronSession(req, res, sessionOptions);
    const adminLogged: boolean | undefined = (session as any).adminLogged;

    if (!adminLogged
    ) {
        return {
            props: {},
        };
    } else {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            }
        };
    }
}*/
    
}

export default AdminLoginPage;