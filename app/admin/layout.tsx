import "@styles/adminStyles.scss"

const AdminLayout = ({ children }: React.PropsWithChildren) => {

	return (
		<div className="admin">
			{children}
		</div>
	)

}

export default AdminLayout;