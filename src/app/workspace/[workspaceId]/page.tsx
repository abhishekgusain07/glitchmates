"use client";

import { useRouter } from "next/navigation";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";

const WorkspacePage = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal()

    const {data: workspace, isLoading: WorkspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: ChannelsLoading} = useGetChannels({workspaceId})

    const channelId = useMemo(() => {
        return channels?.[0]?._id
    }, [channels])
    useEffect(() => {
        if(WorkspaceLoading || ChannelsLoading || !workspace) return;
        if(channelId){
            router.push(`/workspace/${workspaceId}/channel/${channelId}`)
        }else if(!open) {
            setOpen(true)
        }
    },[WorkspaceLoading, ChannelsLoading, workspace, channelId, router, workspaceId, open, setOpen])

    if(WorkspaceLoading || ChannelsLoading){
        return (
            <div className="h-full flex flex-1 justify-center items-center gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }
    if(!workspace){
        return (
            <div className="h-full flex flex-col flex-1 justify-center items-center gap-2">
                <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Workspace not found</span>
            </div>  
        )
    }
   return null;
}

export default WorkspacePage;