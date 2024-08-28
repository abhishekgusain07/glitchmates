import { format, isToday, isYesterday } from "date-fns";
import type{ Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./thumbnail";

const Renderer = dynamic(() => import("@/components/renderer"), {
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
    if(isCompact){
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                
                <div className="flex items-start gap-2">
                <Hint label={formatFullDate(new Date(createdAt))}>
                    <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline" type="button">
                        {format(new Date(createdAt), "hh:mm")}
                    </button>
                    </Hint>
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
                        {image}
                    </div> 
                </div>
            </div>
        )
    }
    const avatarFallback = authorName.slice(0,1).toUpperCase();
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <button type="button">
                        <Avatar >
                            <AvatarImage src={authorImage} className="rounded-md"/>
                            <AvatarFallback>
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
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
                    </div>
                </div>
        </div>
    )
}