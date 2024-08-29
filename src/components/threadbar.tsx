

import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
    count?: number;
    image?: string;
    timeStamp?: number;
    onClick?: () => void;
    name?: string;
}
const ThreadBar = ({
    count, 
    image, 
    timeStamp,
    onClick,
    name
}: ThreadBarProps) => {
    if(!count  || !timeStamp) return null;
    const avatarName = name?.charAt(0).toUpperCase();
    return (
        <button 
            type="button"
            className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center gap-x-2 justify-start group/thread-bar transition max-w-[600px]"
            onClick={onClick}
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0">
                    <AvatarImage src={image}/>
                    <AvatarFallback>
                        {avatarName} 
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm text-sky-700 hover:underline font-bold truncate"> 
                    {count} {count > 1 ? "replies" : "reply"}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Last reply {formatDistanceToNow(timeStamp, { addSuffix: true  })}
                </span>

                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
                    view thread
                </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground opacity-0 ml-auto group-hover/thread-bar:opacity-100 transition-opacity duration-200 shrink-0" />
        </button>
    )
}

export default ThreadBar;
