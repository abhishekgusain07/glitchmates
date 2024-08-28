'use client'

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./header";

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const {data: channel, isLoading: ChannelLoading} = useGetChannel({id: channelId});
    if(ChannelLoading){
        return (
            <div className="flex-1 h-full flex  items-center justify-center">
                <Loader className="animate-spin text-muted-foreground size-5" />
            </div>
        )
    }
    if(!channel){
        return (
            <div className="flex-1 h-full flex flex-col  items-center gap-y-2 justify-center">
                <TriangleAlert className=" text-muted-foreground size-6 text-red-500" />
                <span className="text-muted-foreground text-sm">Channel not found</span>
            </div>
        )
    }
    return (
        <div className="h-full flex flex-col">
            <ChannelHeader title={channel.name} />
        </div> 
    )
}

export default ChannelIdPage;