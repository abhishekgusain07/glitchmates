'use client'

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./header";
import ChatInput from "./chatinput";
import Editor from "@/components/editor";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const {results, status, loadMore} = useGetMessages({channelId})
    const {data: channel, isLoading: ChannelLoading} = useGetChannel({id: channelId});
    if(ChannelLoading || status === "LoadingFirstPage"){
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
            <MessageList 
                variant="channel"
                channelName={channel.name}
                data={results}
                channelCreationTime={channel._creationTime}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput 
                placeholder={`Message # ${channel.name}`}
            />
        </div> 
    )
}

export default ChannelIdPage;