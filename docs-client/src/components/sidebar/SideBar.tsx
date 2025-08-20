"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Upload, Home, Settings } from "lucide-react"

export default function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Create Docs",
      href: "/driver",
      icon: Plus,
    },
    {
      name: "Upload File",
      href: "/driver/land",
      icon: Upload,
    },
  ]

  return (
    <div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[100] h-full w-64 min-w-64 transform bg-gradient-to-b from-white via-gray-50/50 to-white border-r border-gray-200/60 shadow-2xl transition-all duration-300 ease-in-out lg:z-[100] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-sm opacity-70"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg">
                <span className="text-xl font-bold tracking-tight">DC</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                E-DEAL
              </span>
              <span className="text-xs text-gray-500 font-medium">Deal Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6">
          <div className="mb-4">
            <span className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </span>
          </div>
          <nav className="space-y-2">
            {routes.map((route, index) => {
              const isActive = pathname === route.href

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]"
                      : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-700 text-gray-700 hover:transform hover:scale-[1.01]"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-sm"></div>
                  )}
                  
                  <div className={`relative ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}>
                    <route.icon
                      className={`h-5 w-5 transition-all duration-200 ${
                        isActive 
                          ? "text-white drop-shadow-sm" 
                          : "text-gray-500 group-hover:text-blue-600 group-hover:scale-110"
                      }`}
                    />
                  </div>
                  
                  <span className={`transition-all duration-200 ${
                    isActive 
                      ? "text-white font-semibold" 
                      : "text-gray-700 group-hover:text-blue-700 group-hover:font-semibold"
                  }`}>
                    {route.name}
                  </span>

                  {/* Hover effect indicator */}
                  {!isActive && (
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-gradient-to-t from-gray-50/50 to-transparent">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">System Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}