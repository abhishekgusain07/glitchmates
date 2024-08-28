"use client";

import { useRouter } from "next/navigation";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const WorkspacePage = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal()

    const {data: workspace, isLoading: WorkspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: ChannelsLoading} = useGetChannels({workspaceId})
    const {data: members, isLoading: MembersLoading} = useCurrentMember ({workspaceId})

    const channelId = useMemo(() => {
        return channels?.[0]?._id
    }, [channels])
    const isAdmin = useMemo(() => {
        return members?.role === 'admin'
    }, [members?.role])


    useEffect(() => {
        if(WorkspaceLoading || ChannelsLoading || MembersLoading || !members || !workspace) return;
        if(channelId){
            router.push(`/workspace/${workspaceId}/channel/${channelId}`)
        }else if(!open && isAdmin) {
            setOpen(true)
        }
    },[WorkspaceLoading, ChannelsLoading, workspace, channelId, router, workspaceId, open, setOpen, members, MembersLoading, isAdmin])

    if(WorkspaceLoading || ChannelsLoading || MembersLoading){
        return (
            <div className="h-full flex flex-1 justify-center items-center gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }
    if(!workspace || !members){
        return (
            <div className="h-full flex flex-col flex-1 justify-center items-center gap-2">
                <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Workspace not found</span>
            </div>  
        )
    }
   return (
    <div className="h-full flex flex-col flex-1 justify-center items-enter gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
            No channel found
        </span>
    </div>
   );
}

export default WorkspacePage;