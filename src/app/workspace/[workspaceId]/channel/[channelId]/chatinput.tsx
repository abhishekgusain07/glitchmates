import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/use-generate-uploadUrl";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import type Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(()=>import("@/components/editor"), {
    ssr: false
})

interface ChatInputProps {
    placeholder: string;
}
type CreateMessageValues = {
    body: string;
    image: Id<"_storage"> | undefined;
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
}
const ChatInput = ({placeholder}: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);
    
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {mutate:createMessage, isPending:isCreatingMessage} = useCreateMessage()

    const {mutate:generateUploadUrl} = useGenerateUploadUrl()

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
