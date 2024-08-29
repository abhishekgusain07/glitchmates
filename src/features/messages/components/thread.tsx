import { Button } from "@/components/ui/button";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message-byId";
import { Message } from "@/components/messagebox";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/use-generate-uploadUrl";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";


const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

const TIME_THRESHOLD = 5;

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}


type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    body: string;
    image: Id<"_storage"> | undefined;
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

export const Thread = ({messageId, onClose}: ThreadProps) => {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const {data: message, isLoading: loadingMessage} = useGetMessage({id: messageId})
    const {data: member} = useCurrentMember({workspaceId})


    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
    const [editorKey, setEditorKey] = useState(0)
    const [isPending, setIsPending] = useState(false)

    const editorRef = useRef<Quill | null>(null)
     
    const {mutate: createMessage} = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()
    const {results , status, loadMore} = useGetMessages({
        parentMessageId: messageId,
        channelId,
    })

    const canLoadMore = status === "CanLoadMore"
    const isLoadingMore = status === "LoadingMore"

    const handleSubmit = async({
        body, 
        image
    }:{
        body: string;
        image: File | null;
    }) => {
        console.log(body, image);
        try {
            setIsPending(true);
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                workspaceId,
                channelId,
                parentMessageId: messageId,
                body,
                image: undefined
            };

            if(image){
                const url = await generateUploadUrl({}, {throwError: true})
                if(!url) throw new Error("Failed to generate upload url")
                const result = await fetch(url, {
                    method: "POST",
                    body: image,
                    headers: {
                        "Content-Type": image.type
                    }
                })
                if(!result.ok) 
                    throw new Error("Failed to upload image")
                const {storageId} = await result.json()
                values.image = storageId
            }

            await createMessage(
                values,
                {throwError: true}
            )
            setEditorKey(prev => prev + 1)
        } catch (error) {
            toast.error("Failed to send message")
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true)
        }
    }
     

    const groupedMessages = results ?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if(!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
    }, {} as Record<string, typeof results>)



    if(loadingMessage || status === "LoadingFirstPage") {
        return(
            <div className="h-[100vh] flex flex-col">
                <div className="flex px-4 h-[49px] border-b items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary roun ded-full" />
                    <p className="text-lg font-bold">Thread</p>
                </div> 
                <Button variant="ghost" onClick={onClose} size="iconSm">
                    <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
                </Button>
            </div>
            <div className="flex flex-col justify-center h-full gap-y-2 items-center gap-2">
                <Loader className="size-5 text-muted-foreground animate-spin"/> 
            </div>
        </div>
        )
    }
    if(!message) {
        return <div className="h-[100vh]">
            <div className="flex px-4 h-[49px] border-b items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    <p className="text-lg font-medium">Thread</p>
                </div> 
                <Button variant="ghost" onClick={onClose} size="iconSm">
                    <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
                </Button>
            </div>
            <div className="flex flex-col justify-center h-full gap-y-2 items-center gap-2">
                <AlertTriangle className="size-5text-muted-foreground"/>
                <p className="text-sm text-muted-foreground">Messages Not Found</p>
            </div>
        </div>
    }
    return (
        <div className="h-full flex flex-col">
            <div className="flex px-4 h-[49px] border-b items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    <p className="text-lg font-medium">Thread</p>
                </div> 
                <Button variant="ghost" onClick={onClose} size="iconSm">
                    <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
                </Button>
            </div>
            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">

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
                                            isAuthor={message.memberId === member?._id}
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
                                            hideThreadButton
                                            threadName={message.threadName}
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
                ref={
                    (el) => {
                        if(el) {
                            const observer = new IntersectionObserver(
                                ([entry]) => {
                                    if(entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            },
                            {threshold: 1.0}
                            );
                        observer.observe(el);
                        return () => observer.disconnect();
                        }
                    }
                }
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
                <Message 
                    id={message._id}
                    body={message.body}
                    image={message.image}
                    createdAt={message._creationTime}
                    updatedAt={message.updatedAt}
                    isEditing={editingId === message._id} 
                    setEditingId={setEditingId}
                    hideThreadButton={true}
                    threadCount={0}
                    threadImage={undefined}
                    reactions={message.reactions}
                    isAuthor={message.memberId === member?._id}
                    authorImage={message.user?.image}
                    authorName={message.user?.name}
                    memeberId={message.memberId}
                    isCompact={false}
                />
            </div>  
            <div className="px-4">
                <Editor
                    key={editorKey}
                    onSubmit={handleSubmit}
                    disabled={isPending}
                    placeholder="Reply..."
                    variant="create"
                    innerRef={editorRef}
                />
            </div>
        </div>
    )       
}