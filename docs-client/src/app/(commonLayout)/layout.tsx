import Sidebar from "@/components/sidebar/SideBar"

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {


    return (
        <div className="flex">
            <Sidebar></Sidebar>
            <div className="flex-1 flex-grow p-5">{children}</div>

        </div>
    )
}
export default CommonLayout