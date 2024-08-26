import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId()
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: workspaces, isLoading: workspacesLoading} = useGetWorkspaces();

    const [_isOpen, setIsOpen] = useCreateWorkspaceModal()
    const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-9 overflow-hidden relative bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
                   {
                    workspaceLoading ? (<Loader className="size-5 animate-spin shrink-0"/> ): (workspace?.name?.charAt(0).toUpperCase())
                   }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem 
                    className="cursor-pointer flex-col justify-start items-start capitalize">
                    {workspace?.name}
                    <span className="text-xs text-muted-foreground">
                        Active Workspace
                    </span>
                    {
                        filteredWorkspaces?.map((w) => (
                            <DropdownMenuItem
                                key={w._id}
                                onClick={() => router.push(`/workspace/${w._id}`)}
                                className="cursor-pointer  capitalize overflow-hidden "
                            >
                                <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2 ">
                                    {w.name.charAt(0).toUpperCase()}
                                </div>
                                <p className="truncate">{w.name}</p>
                            </DropdownMenuItem>
                        ))
                    }
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                            <Plus className="size-5" />
                        </div>
                        Create a new workspace                        
                    </DropdownMenuItem>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default WorkspaceSwitcher;