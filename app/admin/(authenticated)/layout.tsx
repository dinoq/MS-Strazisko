"use client"
import AdminPageLayout from "@features/admin/components/FormPageLayout/AdminPageLayout";
import withAppProviders from "hoc/withAppProviders";

const AdminLayout = ({ children }: React.PropsWithChildren) => {

    return (
        <AdminPageLayout>
            {children}
        </AdminPageLayout>)
}

export default withAppProviders(AdminLayout);