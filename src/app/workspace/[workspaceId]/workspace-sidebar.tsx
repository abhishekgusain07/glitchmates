import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react"
import WorkspaceHeader from "./workspace-header"
import SidebarItem from "./sidebar-item"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { WorkspaceSection } from "./workspace-section"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { UserItem } from "./user-item"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"
import { useChannelId } from "@/hooks/use-channel-id"
import { useMemberId } from "@/hooks/use-member-id"

export const WorkspaceSidebar = () => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId()
    const [_open, setOpen] = useCreateChannelModal();
    const memberId = useMemberId()

    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId})
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: channelsLoading} = useGetChannels
    ({workspaceId})
    const {data: members, isLoading: membersLoading} = useGetMembers({workspaceId})
    


    if(memberLoading || workspaceLoading) {
        return <div className="flex flex-col bg-bgCustom2 h-full items-center justify-center"><Loader className="animate-spin size-5 text-white" /></div>
    }
    if(!member || !workspace) {
        return <div className="flex flex-col bg-bgCustom2 h-full items-center justify-center">
            <AlertTriangle className="size-5 text-white " />
            <p className="text-white text-sm">
                WorkSpace not found
            </p>
        </div>
    }


    return (
        <div className="flex flex-col bg-bgCustom2 h-full border-l-2 pl-2">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem icon={MessageSquareText} label="Threads" id="threads" />
                <SidebarItem icon={SendHorizonal} label="Drafts & Sent" id="drafts" />
            </div>
            <WorkspaceSection 
                    label="Channels"
                    hint="New Channel"
                    onNew = {member.role === 'admin' ? () => {setOpen(true)} : undefined}
                 >
                {
                    channels?.map((item) => (
                        <SidebarItem 
                        key={item._id} 
                        icon={HashIcon} 
                        label={item.name} 
                        id={item._id} 
                        variant={channelId === item._id ? 'active' : 'default'}
                        />
                    ))
                }
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct Messages"
                hint="New Direct Message"
                onNew={() => {}}
            >
            {
                members?.map((item) => (
                    <UserItem
                        key={item._id}
                        label={item.user.name}
                        id={item._id}
                        image={item.user.image}
                        variant={item._id === memberId ? 'active' : 'default'}
                    />
                ))
            }
            </WorkspaceSection>
        </div> 
    )
}