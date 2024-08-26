'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDownIcon, ListFilter, SquareIcon, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./prefrences-modal";
import { useState } from "react";

interface WorkspaceHeaderProps {
    workspace: Doc<'workspaces'>
    isAdmin: boolean
}
const WorkspaceHeader = ({
    workspace,
    isAdmin 
}: WorkspaceHeaderProps) => {
    const [prefrencesOpen, setPrefrencesOpen] = useState<boolean>(false)
    return (
        <>
            <PreferencesModal 
                open={prefrencesOpen} 
                setOpen={setPrefrencesOpen} 
                initialValue={workspace.name} />
            <div className="flex bg-[#5E2C5F] h-[49px] gap-0.5 items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="transparent"
                            size="sm"
                            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                        >
                            <span className="truncate">
                                {workspace.name}
                            </span>
                            <ChevronDownIcon className="w-4 h-4 shrink-0 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="w-64 ml-2">
                        <DropdownMenuItem
                            className="cursor-pointer capitalize"
                        >
                            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="font-bold">{workspace.name}</p>
                                <p className="text-xs text-muted-foreground ">Active Workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onCanPlay={() => {}}
                                >
                                    Invite People to {workspace.name}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => {setPrefrencesOpen(true)}}
                                >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        )} 
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-0.5">
                    <Hint label="Filter Conversations" side="bottom" align="start">
                        <Button variant="transparent" size="iconSm">
                            <ListFilter className="w-4 h-4" />
                        </Button>
                    </Hint>
                    <Hint label="New Message" side="bottom" align="start">
                        <Button variant="transparent" size="iconSm">
                            <SquarePen className="w-4 h-4" />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
        
    )
} 

export default WorkspaceHeader;
