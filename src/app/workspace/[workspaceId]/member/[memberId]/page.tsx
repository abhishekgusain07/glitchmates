'use client'

import { useCreateOrGetConversation } from "@/features/conversations/api/use-createorget-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversation from "./conversation";

const MemberIdPage = () => {

    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)
    const {data , mutate: createOrGetConversation, isPending: isConversationPending} = useCreateOrGetConversation()
    
    useEffect(() => {
        if(workspaceId && memberId) {
            createOrGetConversation({workspaceId, memberId},{
                onSuccess: (data) => {
                    setConversationId(data)
                },
                onError: (error) => {
                    toast.error("Failed to create or get conversation")
                }
            })
        }
    }, [workspaceId, memberId, createOrGetConversation])
    
    if(isConversationPending){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }
    if(!conversationId){
        return (    
            <div className="h-full flex flex-col items-center justify-center">
                <AlertTriangle className="size-6 text-muted-foreground" />
                <p className="text-muted-foreground">Conversation not found</p>
            </div>
        )
    }
    return (
        <Conversation
            id={conversationId} 
        />
    )
}

export default MemberIdPage;