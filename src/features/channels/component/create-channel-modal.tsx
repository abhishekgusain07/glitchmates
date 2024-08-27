'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useCreateChannel();

    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState<string>("");

    const handleClose = () => {
        setName("");
        setOpen(false);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
        setName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({name, workspaceId}, {
            onSuccess: (id) => {
                //Todo: Redirect to the new channel page
                toast.success("Channel created successfully");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
                handleClose();
            },
            onError: (error) => {
                toast.error("failed to create channel");
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        placeholder="e.g. plan-budget"
                        value={name}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        disabled={isPending}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )   
}
