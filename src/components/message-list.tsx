import type { GetMessagesResponseType } from "@/features/messages/api/use-get-messages";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { Message } from "./messagebox";
import ChannelHero from "./channel-hero";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Loader } from "lucide-react";


const TIME_THRESHOLD = 5;
interface MessageListProps {
    channelName?: string;
    memberImag?: string;
    memberName?: string;
    channelCreationTime?: number;
    variant?: "channel" | "conversation" | "thread";
    data: GetMessagesResponseType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string):string => {
    const date = new Date(dateStr);
    if(isToday(date)) {
        return "Today";
    } 
    if(isYesterday(date)) {
        return "Yesterday";
    } 
    return format(date, "EEEE MMMM d");
}
export const MessageList = ({
    channelName,
    memberImag,
    memberName,
    channelCreationTime,
    variant,
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
}: MessageListProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const workspaceId = useWorkspaceId()
    const {data:currentMember} = useCurrentMember({ workspaceId })

    const groupedMessages = data?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if(!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
    }, {} as Record<string, typeof data>)
    return (
        <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
            {
                Object.entries(groupedMessages || {}).map(([dateKey, messages]) => {
                    return (
                        <div key={dateKey}>
                            <div className="text-center my-2 relative">
                                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                                <span className="bg-white
                                relative inline-block px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                    {formatDateLabel(dateKey)}
                                </span>
                            </div>
                            {
                                messages.map((message, index) => {
                                    const prevMessage = messages[index - 1];
                                    const isCompact = prevMessage && 
                                    prevMessage?.user?._id === message?.user?._id && differenceInMinutes(prevMessage._creationTime, message._creationTime) < TIME_THRESHOLD;

                                    return (
                                        <Message
                                            key={message._id}
                                            id={message._id}
                                            memeberId={message.memberId}
                                            authorImage={message.user.image}
                                            authorName={message.user.name}
                                            isAuthor={message.memberId === currentMember?._id}
                                            reactions={message.reactions}
                                            body={message.body}
                                            image={message.image || undefined}
                                            updatedAt={message.updatedAt}
                                            createdAt={message._creationTime}
                                            threadCount={message.threadCount}
                                            threadImage={message.threadImag}
                                            threadTimeStamp={message.threadTimestamp}
                                            isEditing={editingId === message._id}
                                            isCompact={isCompact}
                                            setEditingId={setEditingId}
                                            hideThreadButton={variant === "thread"}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <div 
                className="h-1 "
                ref={(el) => {
                    if(el) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if(entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            },
                            {
                                threshold: 1.0,
                            }
                        );
                        observer.observe(el);
                        return () => observer.disconnect();
                    }
                }}
            />
            {
                isLoadingMore && (
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                        <span className="bg-white
                        relative inline-block px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                            <Loader className="animate-spin size-4"/>
                        </span>
                    </div>
                )
            }
            {
                variant === "channel" && channelName && channelCreationTime && (
                    <ChannelHero
                        channelName={channelName}
                        channelCreationTime={channelCreationTime}
                    />
                )
            }
        </div>
    )
}