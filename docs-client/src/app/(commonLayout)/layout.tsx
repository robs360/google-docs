'use client'
import Header from "@/components/Header/Header"
import Sidebar from "@/components/sidebar/SideBar"
import { useState } from "react"
import { Toaster } from "sonner"

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
    const [openSiderbar, setOpenSiderbar] = useState(false)
    
    return (
        <div className="flex w-full">
            {/* Sidebar - Always render, but hidden on mobile when closed */}
            <div className="hidden lg:block lg:w-64 lg:min-w-64 lg:sticky lg:top-0 h-screen">
                <Sidebar open={openSiderbar} setOpen={setOpenSiderbar} />
            </div>
            
            {/* Mobile Sidebar - Render separately for mobile */}
            <div className="lg:hidden">
                <Sidebar open={openSiderbar} setOpen={setOpenSiderbar} />
            </div>
            
            <div className="flex-1 w-full">
                <Header setOpenSiderbar={setOpenSiderbar} />
                <div className="flex-1 flex-grow p-5 min-w-0">{children}</div>
            </div>
            
            <Toaster position="bottom-right" richColors />
        </div>
    )
}

export default CommonLayout