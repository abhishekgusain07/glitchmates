
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}
export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode
}: InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "This will deactivate the current invite code and regenerate a new one"
    )

    const { mutate, isPending } = useNewJoinCode()
    const handleCopy = () => {
        // TODO: add the join code to the link
        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard.writeText(inviteLink)
       .then(() => {
        toast.success("Copied to clipboard")
       })
       .catch((error) => {
        toast.error("Failed to copy to clipboard")
       })
    }  
    const handleNewCode = async() => {
        //this opens a new dialog to confirm the action
        const ok = await confirm()
        if(!ok) return
        
        mutate({id:workspaceId},{
            onSuccess: () => {
               toast.success("Invite code regenerated")
            },
            onError: (error) => {
                toast.error("Failed to regenerate invite code")
            }
        })
    }
    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>
                            use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-y-4 justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                        >
                            Copy Link
                            <CopyIcon className="size-4 ml-2" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={handleNewCode}
                        >
                            New Code
                            <RefreshCcw className="size-4 ml-2"/>
                        </Button>
                        <DialogClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DialogClose>   
                    </div>
                </DialogContent>
            </Dialog>
        </>
        
    ) 
}
