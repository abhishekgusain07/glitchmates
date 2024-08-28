"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ChannelHeaderProps {
    title: string;
}

export const ChannelHeader = ({title}: ChannelHeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()

    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(title);

    const {data: member} = useCurrentMember({workspaceId})
    const {mutate: updateChannel, isPending: isUpdatingChannel} = useUpdateChannel()
    const {mutate: removeChannel , isPending: isRemovingChannel} = useRemoveChannel()

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete This Channel?",
        "You are about to delete this channel. This action is irreversible",
    );

    const handleEditOpen = () => {
        if(member?.role === "member") {
            toast.error("You are not allowed to rename this channel");
            return;
        }
        setEditOpen(true);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateChannel({id: channelId, name: value},{
            onSuccess: () => {
                toast.success("Channel Updated");
                setEditOpen(false);
            },
            onError: (error) => {
                toast.error("Failed to update channel");
            }
        })
    }

    const handleDelete = async() => {
        const ok = await confirm()
        if(!ok)return

        removeChannel({id: channelId},{
            onSuccess: () => {
                toast.success("Channel deleted");
                router.push(`/workspace/${workspaceId}`)
                
            },
            onError: (error) => {
                toast.error("Failed to delete channel");
            }
        })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    return (
        <>
        <ConfirmDialog />
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-lg font-semibold px-2 overflow-hidden w-auto"
                    >
                    <span className="truncate">
                        # {title}
                    </span>
                    <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            # {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">channel name</p>
                                        {
                                            member?.role === "admin" && (
                                                <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                                                Edit
                                            </p> 
                                            )
                                        }
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        # {title}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename channel
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <Input 
                                        value={value}
                                        disabled={isUpdatingChannel}
                                        onChange={handleChange}
                                        placeholder="e.g. plan-trip"
                                        autoFocus
                                        required
                                        minLength={3}
                                        maxLength={80}

                                    />
                                    <DialogFooter className="mt-4">
                                        <DialogClose asChild>
                                            <Button 
                                                variant="outline"
                                                disabled={isUpdatingChannel}
                                            >
                                                cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdatingChannel}>
                                            save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button 
                        type="button"
                        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 font-semibold"
                        onClick={handleDelete}
                        disabled={isRemovingChannel}
                        >
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">Delete channel</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        </>
    )
}