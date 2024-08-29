import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
    memberName?:string;
    memberImag?: string
}
export const ConversationHero = ({memberName="Member", memberImag="https://github.com/shadcn.png"}: ConversationHeroProps) => {
    const avatarFallback = memberName.charAt(0).toUpperCase()
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <div className="flex items-center gap-x-1 mb-2">
                <Avatar className="size-14 mr-2">
                    <AvatarImage src={memberImag}/>
                    <AvatarFallback
                        className="bg-slate-200"
                    >
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <p className="text-2xl font-bold">
                    {memberName}
                </p>
            </div>
            
            <p className="mb-4 text-slate-800 font-normal">
                This Conversation is just between you and <strong>{memberName}</strong>
            </p>
        </div>
    )
}