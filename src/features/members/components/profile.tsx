import { Button } from "@/components/ui/button"
import type { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use-get-member"
import { AlertTriangle, CheckIcon, ChevronDown, Loader, MailIcon, XIcon } from "lucide-react"
import {
    Avatar, 
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useUpdateMember } from "../api/use-update-member"
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel"
import { useRemoveMember } from "../api/use-remove-member"
import { useCurrentMember } from "../api/use-current-member"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"


interface ProfileProps {
    memberId: Id<'members'>
    onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
    const router = useRouter()

    const [LeaveDialog, confirmLeave] = useConfirm(
        'Leave Workspace',
        'Are you sure you want to leave this workspace?',
    )
    const [RemoveDialog, confirmRemove] = useConfirm(
        'Remove Member',
        'Are you sure you want to remove this member?',
    )
    const [UpdateDialog, confirmUpdate] = useConfirm(
        'Update Role',
        'Are you sure you want to update the role of this member?',
    )

    
    const workspaceId = useWorkspaceId()
    const {data: currentMember, isLoading: isLoadingCurrentMember} = useCurrentMember({
        workspaceId
    })


    const {data: member, isLoading: isLoadingMember} = useGetMember({
        id: memberId
    })

    const fallback = member?.user.name?.charAt(0).toUpperCase() || "M"

    const {mutate: updateMember, isPending: isUpdatingMember} = useUpdateMember()
    const {mutate: removeMember, isPending: isRemovingMember} = useRemoveMember()
    
    const onRemove = async () => {
        const ok = await confirmRemove()
        if(!ok) return
        removeMember({
            id: memberId
        },{
            onSuccess: () => {
                toast.success("Member removed successfully")
                onClose()
            },
            onError: (error) => {
                toast.error("Failed to remove member")
            }
        })
    }
    //96tfjj
    const onLeave = async () => {
        const ok = await confirmLeave()
        if(!ok) return

        removeMember({
            id: memberId
        },{
            onSuccess: () => {
                toast.success("You Left the workspace")
                onClose()
                router.replace('/')
            },
            onError: (error) => {
                toast.error("Failed to leave the workspace")
            }
        })
    }

    const onUpdate = async(role: "admin" | "member") => {
        const ok = await confirmUpdate()
        if(!ok) return
         
        updateMember({
            id: memberId,
            role
        },{
            onSuccess: () => {
                toast.success("Role Changed Successfully")
            },
            onError: (error) => {
                toast.error("Failed to change role")
            },
        })
    }
    if(isLoadingMember || isLoadingCurrentMember) {
        return(
            <div className="h-[100vh] flex flex-col">
                <div className="flex px-4 h-[49px] border-b items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary roun ded-full" />
                    <p className="text-lg font-bold">Profile</p>
                </div> 
                <Button variant="ghost" onClick={onClose} size="iconSm">
                    <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
                </Button>
            </div>
            <div className="flex flex-col justify-center h-full gap-y-2 items-center gap-2">
                <Loader className="size-5 text-muted-foreground animate-spin"/> 
            </div>
        </div>
        )
    }
    if(!member) {
        return <div className="h-[100vh]">
            <div className="flex px-4 h-[49px] border-b items-center justify-between">
            <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    <p className="text-lg font-medium">Profile</p>
                </div> 
                <Button variant="ghost" onClick={onClose} size="iconSm">
                    <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
                </Button>
            </div>
            <div className="flex flex-col justify-center h-full gap-y-2 items-center gap-2">
                <AlertTriangle className="size-5text-muted-foreground"/>
                <p className="text-sm text-muted-foreground">Member Not Found</p>
            </div>
        </div>
    }
    return (
        <>
        <LeaveDialog />
        <RemoveDialog />
        <UpdateDialog />
        <div className="h-[100vh]">
            <div className="flex px-4 h-[49px] border-b items-center justify-between">
            <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    <p className="text-lg font-medium">Profile</p>
            </div> 
            <Button variant="ghost" onClick={onClose} size="iconSm">
                <XIcon className="size-5 stroke-[1.5] text-lg font-bold"/> 
            </Button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[256px] max-h-[256px] size-full">
                    <AvatarImage src={member?.user?.image} />
                    <AvatarFallback className="aspect-square text-6xl">
                        {fallback}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col p-4">
                <p className="text-lg font-bold">{member.user.name}</p>{
                    currentMember?.role === "admin" && currentMember._id !== memberId ? (
                        <div className="flex gap-2 items-center mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button className="w-full capitalize" variant="outline">
                                    {member.role} <ChevronDown className="size-4 ml-2"/>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onUpdate("admin")}>
                                        Admin {member.role === 'admin'&& (<span><CheckIcon className="size-4 mr-2"/></span>)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onUpdate("member")}>
                                        Member {member.role === 'member' &&(<span><CheckIcon className="size-4 ml-2 text-green-500 stroke-[4]"/></span>)}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        <Button variant="outline" className="w-full"
                        onClick={onRemove}
                        >
                            Remove
                        </Button>
                        </div>
                    ) : currentMember?.role !== "admin" && currentMember?._id === memberId ? (
                        <div className="flex gap-2 items-center mt-4"> 
                        <Button variant="outline" className="w-full mt-4"
                        onClick={onLeave}
                        >
                            Leave
                        </Button>
                        </div>
                    ): null
                }
            </div>
            <Separator />
            <div className="flex flex-col p-4">
                <p className="text-lg font-bold mb-4">Contact Information</p>
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon className="size-5 stroke-[1.5] text-muted-foreground"/>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] text-muted-foreground font-semibold">Email Address</p>
                        <Link href={`mailto:${member.user.email}`} className="text-sm font-medium hover:underline text-[#1264a3]">
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )   
} 