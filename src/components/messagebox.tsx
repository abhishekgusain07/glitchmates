import { format, isToday, isYesterday } from "date-fns";
import type{ Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/use-toggle-reaction";
import Reactions from "./reactions";

const Renderer = dynamic(() => import("@/components/renderer"), {
    ssr: false,
})
const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
})

interface MessageProps {
    id: Id<"messages">;
    memeberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | undefined | null;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimeStamp?: number;
}

const formatFullDate = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "hh:mm a")}`
}

export const Message = ({
    id,
    memeberId,
    authorImage,
    authorName = "Member",
    isAuthor,
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimeStamp,
}: MessageProps) => {
    
    const [ConfirmDialog, confirm] = useConfirm(
        'Delete Message',
        'Are you sure you want to delete this message? this action cannot be undone.'
    )

    const {mutate: updateMessage, isPending: isUpdatingMessage} = useUpdateMessage();
    const {mutate: removeMessage, isPending: isRemovingMessage} = useRemoveMessage();
    const {mutate: toggleReaction, isPending: isTogglingReaction} = useToggleReaction();


    const isPending = isUpdatingMessage || isRemovingMessage;

    const handleUpdateMessage = ({body}: {body:string}) => {
        updateMessage({id, body},{
            onSuccess: () => {
                toast.success("Message updated")
                setEditingId(null)
            },
            onError: (error) => {
                toast.error("Failed to update message");
            }
        })
    }
    const handleRemoveMessage = async() => {
        const ok = await confirm();
        if(!ok) return;

        removeMessage({id},{
            onSuccess: () => {
                toast.success("Message deleted")

                //Todo: Close thread if it's open
            },
            onError: (error) => {
                toast.error("Failed to remove message");
            }
        })
    }

    const handleToggleReaction = (value: string) => {
        toggleReaction({messageId: id, value}, {
            onError: (error) => {
                toast.error("Failed to toggle reaction")
            }
        })
    }
    if(isCompact){
        return (
            <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage && "bg-rose-500/50 transform transition-all duration-300 scale-y-0 origin-bottom")}>
                <ConfirmDialog/>
                <div className="flex items-start gap-2">
                <Hint label={formatFullDate(new Date(createdAt))}>
                    <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline" type="button">
                        {format(new Date(createdAt), "hh:mm")}
                    </button>
                </Hint>
                {
                    isEditing ? (
                        <div className="h-full w-full">
                            <Editor
                                onSubmit={handleUpdateMessage}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                variant="update"
                            />
                        </div>
                    ) : (
                    <div className="flex flex-col w-full">
                        <Renderer value={body}/>
                        <Thumbnail url={image}/>
                        {
                            updatedAt ? (
                                <span className="text-xs text-muted-foreground">
                                    (edited)
                                </span>
                            ): null
                            }
                            <Reactions 
                                data={reactions}
                                onChange={handleToggleReaction}
                            />
                        </div>
                    )
                }
                </div>
                {
                    !isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => {
                                setEditingId(id)
                            }}
                            handleDelete={handleRemoveMessage}
                            handleThread={() => {}}
                            hideThreadButton={hideThreadButton}
                            handleReaction={handleToggleReaction}
                        />
                    )
                }
            </div>
        )
    }
    const avatarFallback = authorName.slice(0,1).toUpperCase();
    return (
        <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        isRemovingMessage && "bg-rose-500/50 transform transition-all duration-300 scale-y-0 origin-bottom")}>
            <ConfirmDialog/>
                <div className="flex items-start gap-2">
                    <button type="button">
                        <Avatar >
                            <AvatarImage src={authorImage} className="rounded-md"/>
                            <AvatarFallback>
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {
                        isEditing ? (
                            <div className="h-full w-full">
                                <Editor
                                    onSubmit={handleUpdateMessage}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    variant="update"
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full overflow-hidden">
                        <div className="text-sm">
                            <button
                                type="button"
                                className="font-bold text-primary hover:underline"
                                onClick={() => {
                                    
                                }}
                            >
                                {authorName}
                            </button>
                            <span>&nbsp;&nbsp;</span>
                            <Hint label={formatFullDate(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground hover:underline" type="button">
                                {format(new Date(createdAt), "hh:mm a")}
                            </button>
                            </Hint>
                        </div>
                        <Renderer value={body}/>
                        <Thumbnail url={image}/>
                        {
                            updatedAt ? (
                                <span className="text-xs text-muted-foreground">
                                    (edited)
                                </span>
                            ): null
                        }
                        <Reactions 
                            data={reactions}
                            onChange={handleToggleReaction}
                        />
                    </div>
                )} 
                </div>
                {
                    !isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => {
                                setEditingId(id)
                            }}
                            handleDelete={handleRemoveMessage}
                            handleThread={() => {}}
                            hideThreadButton={hideThreadButton}
                            handleReaction={handleToggleReaction}
                        />
                    )
                }
        </div>
    )
}