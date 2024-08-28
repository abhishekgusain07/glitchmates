import type { GetMessagesResponseType } from "@/features/messages/api/use-get-messages";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { Message } from "./messagebox";


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
                                            isAuthor={false}
                                            reactions={message.reactions}
                                            body={message.body}
                                            image={message.image || undefined}
                                            updatedAt={message.updatedAt}
                                            createdAt={message._creationTime}
                                            threadCount={message.threadCount}
                                            threadImage={message.threadImag}
                                            threadTimeStamp={message.threadTimestamp}
                                            isEditing={false}
                                            isCompact={isCompact}
                                            setEditingId={() => {}}
                                            hideThreadButton={false}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}