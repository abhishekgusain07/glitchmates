'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkSpace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkSpace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


interface PreferencesModalProps {
    open: boolean
    setOpen: (open: boolean) => void;
    initialValue: string;
}
export const PreferencesModal = ({
    open,
    setOpen,
    initialValue
}: PreferencesModalProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()

    const [ConfirmDialog, confirm] = useConfirm('Delete workspace', 'Are you sure you want to delete this workspace? This action cannot be undone.')
    const [value, setValue] = useState<string>(initialValue)
    const [editOpen, setEditOpen] = useState<boolean>(false)

    const {mutate: updateWorkSpace, isPending:isUpdatingWorkSpace} = useUpdateWorkSpace()
    const {mutate: removeWorkSpace, isPending:isRemovingWorkSpace} = useRemoveWorkSpace()

    const handleRemove = async () => {
        const confirmed = await confirm()
        if(!confirmed) return;
        removeWorkSpace({
            id: workspaceId 
        }, {
            onSuccess: () => {
                toast.success("Workspace Removed")
                router.replace('/')
            },
            onError: (error) => {
                toast.error('Failed to Remove workspace')
            },
        })
    }
    const handleEdit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateWorkSpace({
            id: workspaceId,
            name: value
        }, {
            onSuccess: () => {
                setEditOpen(false)
                toast.success("Workspace name updated")
            },
            onError: (error) => {
                toast.error('Failed to update workspace name')
            },
        })
    }

    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">
                                    Workspace name
                                </p>
                                <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                    Edit
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {value}
                            </p>
                        </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this workspace</DialogTitle>
                            </DialogHeader>
                            <form  className="space-y-4" onSubmit={handleEdit}>
                                <Input 
                                    value={value}
                                    disabled={isUpdatingWorkSpace}
                                    onChange={(e) => setValue(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                    minLength={3}
                                    maxLength={80}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            disabled={isUpdatingWorkSpace}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        disabled={isUpdatingWorkSpace}
                                    >
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog> 
                    <button
                        disabled={isRemovingWorkSpace}
                        onClick={handleRemove}
                        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                    >
                        <TrashIcon className="size-4" />
                        <p className="text-sm font-semibold">
                            Delete workspace
                        </p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
        </>
        
    )
}
