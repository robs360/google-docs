'use client'
import Header from "@/components/Header/Header"
import Sidebar from "@/components/sidebar/SideBar"
import { useState } from "react"

const CommonLayout =  ({ children }: { children: React.ReactNode }) => {
    const [openSiderbar, setOpenSiderbar]=useState(false)
    return (
       <div>
        <Header setOpenSiderbar={setOpenSiderbar}></Header>
         <div className="flex">
            <Sidebar open={openSiderbar} setOpen={setOpenSiderbar}></Sidebar>
            <div className="flex-1 flex-grow p-5">{children}</div>

        </div>
       </div>
    )
}
export default CommonLayout