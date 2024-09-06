'use client'

import { UserButton } from "@/features/auth/components/user-button";
import WorkspaceSwitcher from "./workspaceswitcher";
import { useEffect, useState } from "react";
import { Bell, Home, Loader, MessageSquare, MoreHorizontal } from "lucide-react";
import SidebarButton from "./sidebar-button";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const pathname = usePathname();
    if (!isClient) return <Loader className=" size-5 my-auto animate-spin" />;
    return (
        <aside className="bg-bgCustom2/70 w-[70px] flex flex-col  items-center gap-y-4 pt-[9px] pb-[4px] h-full">
            <WorkspaceSwitcher />
            <SidebarButton icon={Home} label="Home" isActive={pathname.includes('/workspace')}/>
            <SidebarButton icon={MessageSquare} label="DMs" />
            <SidebarButton icon={Bell} label="Activity" />
            <SidebarButton icon={MoreHorizontal} label="More" />
            <div className="flex flex-col justify-center gap-y-1 mt-auto items-center">
                <UserButton />
            </div>
        </aside>
    )
}

export default Sidebar;