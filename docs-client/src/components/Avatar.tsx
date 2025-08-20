"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface User {
    name: string;
    email: string;
    image: string;
    id?: string;
}

export function DropdownMenuCheckboxes() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)
    const [user, setUser] = React.useState<User | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const userData = localStorage.getItem("user")

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData)
                setUser(parsedUser)
                console.log("User loaded:", parsedUser)
            } catch (err) {
                console.error("Failed to parse user data:", err)
                setUser(null)
            }
        }

        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <Button variant="ghost" disabled className="p-2 h-auto">
                <div className="w-[40px] h-[40px] rounded-full bg-gray-200 animate-pulse"></div>
            </Button>
        )
    }

    if (!user) {
        return (
            <Button variant="ghost" className="p-2 h-auto">
                <div className="w-[40px] h-[40px] rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                    ?
                </div>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* ✅ Fix 1: Use variant="ghost" and proper padding */}
                <Button 
                    variant="ghost" 
                    className="p-2 h-auto hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
                >
                    {/* ✅ Fix 2: Make image container round and set proper dimensions */}
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                            src={user.image || "https://i.ibb.co/v641P3Z/clude.png"}
                            width={40}
                            height={40}
                            alt={user.name || "User avatar"}
                            className="w-full h-full object-cover" // ✅ Fix 3: Proper image sizing
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/40/cccccc/666666?text=" + (user.name?.charAt(0) || "U");
                            }}
                        />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                        {/* ✅ Show small avatar in dropdown header too */}
                        <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
                            <Image
                                src={user.image || "https://i.ibb.co/v641P3Z/clude.png"}
                                width={32}
                                height={32}
                                alt={user.name || "User avatar"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.name || "Unknown User"}</span>
                            <span className="text-sm text-gray-500">{user.email || ""}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                    checked={showStatusBar}
                    onCheckedChange={setShowStatusBar}
                >
                    Status Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showActivityBar}
                    onCheckedChange={setShowActivityBar}
                    disabled
                >
                    Activity Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showPanel}
                    onCheckedChange={setShowPanel}
                >
                    Panel
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem 
                    onSelect={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}
                    className="text-red-600 focus:text-red-600"
                >
                    Logout
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ===============================================
// Alternative version with cleaner styling
// ===============================================

export function DropdownMenuCheckboxesClean() {
    const [user, setUser] = React.useState<User | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (err) {
                console.error("Failed to parse user data:", err)
            }
        }
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        )
    }

    if (!user) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                ?
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* ✅ Clean button without default styles */}
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
                    <Image
                        src={user.image || "https://i.ibb.co/v641P3Z/clude.png"}
                        width={40}
                        height={40}
                        alt={user.name || "User avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/40/cccccc/666666?text=" + (user.name?.charAt(0) || "U");
                        }}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                                src={user.image || "https://i.ibb.co/v641P3Z/clude.png"}
                                width={32}
                                height={32}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Your menu items here */}
                <DropdownMenuCheckboxItem>
                    Profile Settings
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                    Account Preferences  
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem 
                    onSelect={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    Sign out
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ===============================================  
// Version with custom avatar component
// ===============================================

interface AvatarProps {
    src?: string;
    name: string;
    size?: number;
    className?: string;
}

function Avatar({ src, name, size = 40, className = "" }: AvatarProps) {
    const [imgError, setImgError] = React.useState(false);
    
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=6366f1&color=ffffff`;
    
    return (
        <div 
            className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {src && !imgError ? (
                <Image
                    src={src}
                    width={size}
                    height={size}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <Image
                    src={fallbackUrl}
                    width={size}
                    height={size}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}

export function DropdownMenuWithCustomAvatar() {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.error("Failed to parse user data:", err);
            }
        }
    }, []);

    if (!user) {
        return <Avatar name="User" className="cursor-pointer" />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
                    <Avatar 
                        src={user.image} 
                        name={user.name} 
                        className="hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer" 
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                        <Avatar src={user.image} name={user.name} size={32} />
                        <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem>
                    View Profile
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                    Settings
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuCheckboxItem 
                    onSelect={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    Sign out
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}