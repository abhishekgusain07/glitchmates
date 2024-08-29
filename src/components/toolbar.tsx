import { MessageSquareText, Pencil, SmileIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import EmojiPopover from "./emoji-popover";

interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
    handleThread: () => void;
    hideThreadButton?: boolean | undefined;
    handleReaction: (value: string) => void;
}

const Toolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleDelete,
    handleThread,
    hideThreadButton,
    handleReaction,
}: ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 border bg-white rounded-md shadow-sm">
                <EmojiPopover
                    hint="Add reaction"
                    onEmojiSelect={(value) => {
                        handleReaction(value)
                    }}
                >
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={isPending}
                    >
                        <SmileIcon className="size-4" />
                    </Button>
                </EmojiPopover>
                {
                    !hideThreadButton && (
                        <Hint label="Reply in thread">
                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={isPending}
                                onClick={handleThread}
                            >
                                <MessageSquareText className="size-4" />
                            </Button>
                        </Hint>
                    )
                }
                {
                    isAuthor && (
                        <>
                            <Hint label="Edit message">
                                <Button
                                    variant="ghost"
                                    size="iconSm"
                                    disabled={isPending}
                                    onClick={handleEdit}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            </Hint>
                            <Hint label="Delete message">
                                <Button
                                    variant="ghost"
                                    size="iconSm"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                >
                                    <Trash className="size-4" />
                                </Button>
                            </Hint>
                        </>
                    )
                }
                
            </div>
        </div>
    )
}

export default Toolbar;