'use client'
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Calendar, Info, Search, User } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useState } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Toolbar = () => {
    
    const router = useRouter();
    
    const [open, setOpen] = useState(false);
    
    const workspaceId = useWorkspaceId();
    const {data} = useGetWorkspace({id: workspaceId});


    const {data:channels, isLoading: channelsLoading} = useGetChannels({workspaceId})
    const {data:members, isLoading: membersLoading} = useGetMembers({workspaceId})

    const onChannelClick = (channelId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    }
    const onMemberClick = (memberId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/member/${memberId}`);
    }
    return (
        <div className="bg-bgCustom2/70 flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink  ml-0 md:ml-[3rem]">
                <Button 
                size="sm" 
                className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
                onClick={() => setOpen(true)}
                >
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs">Search {data?.name}</span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search messages, files, and more..." />
                    <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Channels">
                        {
                            channels?.map((channel) => (
                                <CommandItem key={channel?._id}  onSelect={() => onChannelClick(channel?._id)}>
                                   <span>{channel.name}</span>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Members">
                        {
                            members?.map((member) => (
                                <CommandItem key={member?._id}
                                    onSelect={() => onMemberClick(member?._id)}
                                >
                                    <span>{member?.user.name}</span>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button size="iconSm" variant="transparent">
                    <Info className="size-5 text-white" />
                </Button> 
            </div>
        </div>
    )
}
export default Toolbar;
