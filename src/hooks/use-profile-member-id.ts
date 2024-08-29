import { useProfileMemberId } from "@/features/members/store/use-profile-member-id"
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id"

export const usePanel = () => {
    const [profileMemberId, setProfileMemberId] = useProfileMemberId()
    const [parentMessageId, setParentMessageId] = useParentMessageId()

    const onOpenMessage = (messageId: string) => {
        setProfileMemberId(null)
        setParentMessageId(messageId)
    }
    const onOpenProfile = (memberId: string) => {   
        setProfileMemberId(memberId)
        setParentMessageId(null)
    }

    const onClose = () => {
        setProfileMemberId(null)
        setParentMessageId(null)
    }

    return {
        profileMemberId,
        parentMessageId,
        onOpenMessage,
        onClose,
        onOpenProfile,
    }
} 