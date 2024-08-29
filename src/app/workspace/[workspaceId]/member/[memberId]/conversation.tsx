import { useMemberId } from "@/hooks/use-member-id";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { ChannelHeader } from "../../channel/[channelId]/header";
import { ConversationHeader } from "./conversationHeader";
import ChannelChatInput from "./chat-input-member";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";


interface ConversationPageProps {
    id: Id<"conversations">;
}
const Conversation = ({ id}: ConversationPageProps) => {
    const memberId = useMemberId();

    const { onOpenProfile } = usePanel()
    const {data:member, isLoading: memberLoading} = useGetMember({id: memberId});

    const {results, status, loadMore} = useGetMessages({
        conversationId: id,
    })

    if(memberLoading || status === "LoadingFirstPage"){
        return (
            <div className="flex-1 h-full flex  items-center justify-center">
                <Loader className="animate-spin text-muted-foreground size-5" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <ConversationHeader
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => onOpenProfile(memberId)}
            />
            <MessageList
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
                variant="conversation"
                memberImag={member?.user?.image}
                memberName={member?.user?.name}
            />
            <ChannelChatInput 
                placeholder="Send a message"
                conversationId={id}
            />
        </div>
    )
}

export default Conversation;