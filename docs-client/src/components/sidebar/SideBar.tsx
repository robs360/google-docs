"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Upload, Home, Settings } from "lucide-react"

export default function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
      href: "/driver/performance",
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

    {
      name: "Settings",
      href: "/driver/settings",
      icon: Settings,
    },
  ]

  return (
    <div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[100] h-full w-52 min-w-52 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:z-[100] lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
              <span className="text-lg font-bold">DC</span>
            </div>
            <span className="text-xl font-semibold">E-DEAL</span>
          </div>
        </div>

        <div className="px-3 py-4">
          <nav className="space-y-4">
            {routes.map((route) => {
              const isActive = pathname === route.href

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                >
                  <route.icon
                    className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                  {route.name}
                </Link>
              )
            })}
          </nav>
        </div>

      </div>
    </div>
  )
}
