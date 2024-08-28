import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import type Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(()=>import("@/components/editor"), {
    ssr: false
})

interface ChatInputProps {
    placeholder: string;
}
const ChatInput = ({placeholder}: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);
    
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {mutate:createMessage, isPending:isCreatingMessage} = useCreateMessage()

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
            await createMessage({
                workspaceId,
                channelId,
                body
            }, {throwError: true})
            setEditorKey(prev => prev + 1)
        } catch (error) {
            toast.error("Failed to send message")
        } finally {
            setIsPending(false);
        }
    }
    
    return (
        <div className="px-5 w-full">
            <Editor 
                key={editorKey}
                variant="create" 
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending || isCreatingMessage}
                innerRef={editorRef}
            />
        </div>
    )
}

export default ChatInput;
