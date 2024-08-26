import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";

interface WorkspaceHeaderProps {
    workspace: Doc<'workspaces'>
}
const WorkspaceHeader = ({
    workspace
}: WorkspaceHeaderProps) => {
    return (
        <div className="flex bg-[#5E2C5F] h-[49px] gap-0.5 items-center justify-between">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="transparent"
                        size="sm"
                        className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                    >
                        <span>
                            {workspace.name}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
            </DropdownMenu>
        </div>
    )
} 

export default WorkspaceHeader;
