'use client';

import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VerificationInput, { VerificationInputProps } from "react-verification-input"
import { toast } from "sonner";

const JoinPage = () => {
    const workspaceId = useWorkspaceId()
    const router = useRouter();
    const {data, isLoading} = useGetWorkspaceInfo({id: workspaceId});
    const {mutate, isPending} = useJoin();

    const handleComplete = (value: string) => {
        mutate({joinCode:value, workspaceId},{
            onSuccess: (id) => {
                toast.success("Workspace Joined.")
                router.replace(`/workspace/${id}`);
            },
            onError: (error) => {
                toast.error("Failed to join workspace.")
            }
        });
    }
    if(isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }
    return (
        <div className="h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8 rounded-lg sham">
            <Image src="/next.svg" alt="logo" width={60} height={60} />
            <div className="flex flex-col items-center gap-y-4 justify-center max-w-md">
                <div className="flex flex-col items-center gap-y-2 justify-center">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the Workspace code to join</p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    classNames={{
                        container: cn("flex  gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 text-lg font-medium text-gray-500 flex items-center justify-center",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black",
                        characterFilled: "bg-white text-black",
                    }}
                    autoFocus
                />
            </div>
            <div className="flex gap-x-4">
                <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="shadow-md rounded-lg"
                >
                    <Link href="/">
                        Back To Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default JoinPage;
