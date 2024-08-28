"use client"
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface ChannelHeaderProps {
    title: string;
}
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
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const ChannelHeader = ({title}: ChannelHeaderProps) => {
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(title);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    return (
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
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">channel name</p>
                                        <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                                            Edit
                                        </p>
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
                                <form>
                                    <Input 
                                        value={value}
                                        disabled={false}
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
                                                disabled={false}
                                            >
                                                cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={false}>
                                            save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button 
                        type="button"
                        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 font-semibold">
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">Delete channel</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}