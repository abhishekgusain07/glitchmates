import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { 
    Popover,
    PopoverTrigger, 
    PopoverContent 
} from "./ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "./ui/tooltip";

interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onEmojiSelect: (emoji: any) => void;
}

const EmojiPopover = ({
    children,
    hint = "Emoji",
    onEmojiSelect
}: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onSelect = (emoji: any) => {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 500);
    }
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white border border-white/5">
                        <p className="font-medium text-sm">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent
                    className="p-0 w-full border-none shadow-none"
                >
                    <Picker
                        onEmojiSelect={onSelect}
                        data={data}
                    />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    ) 
}

export default EmojiPopover;
