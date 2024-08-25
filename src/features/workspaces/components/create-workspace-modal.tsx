'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkSpace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState<string>("");
    const {mutate, isPending } = useCreateWorkSpace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            name
        }, {
            onSuccess: (id) => {
                router.push(`/workspace/${id}`);
                handleClose();
            }
        });
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input 
                        placeholder="Workspace Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        disabled={isPending}
                    />
                    <div className="flex justify-end">
                        <Button className="w-full" disabled={false}>
                            Create Workspace
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
