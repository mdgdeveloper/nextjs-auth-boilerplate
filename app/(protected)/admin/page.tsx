import { auth } from "@/auth"
import LogoutButton from "@/components/LogoutButton"

const AdminPage = async () => {

    const session = await auth()

    if (session?.user?.role !== "admin") {
        return <div>Unauthorized</div>
    }



    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <LogoutButton />
        </div>
    )



}
export default AdminPage