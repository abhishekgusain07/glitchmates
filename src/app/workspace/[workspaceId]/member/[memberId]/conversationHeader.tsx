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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
}

export const ConversationHeader = ({
    memberName,
    memberImage,
    onClick,
}: ConversationHeaderProps) => {
    const avatarFallBack = memberName?.charAt(0).toUpperCase();
    return (
        <>
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button onClick={onClick} variant="ghost" size="sm"
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
                <Avatar className="size-6 mr-2">
                    <AvatarImage src={memberImage}  className="rounded-full"/>
                    <AvatarFallback>
                        {avatarFallBack}
                    </AvatarFallback>
                </Avatar>
                <span className="truncate">
                    {memberName}
                </span>
                <FaChevronDown className="size-2.5 ml-2" />
            </Button>
        </div>
        </>
    )
}