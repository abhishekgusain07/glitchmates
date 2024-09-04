"use client";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { Profile } from "@/features/members/components/profile";


interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}
const WorkspaceLayout = ({children}: WorkSpaceIdLayoutProps) => { 

    const {parentMessageId, profileMemberId, onOpenMessage, onCloseMessage, onOpenProfile} = usePanel()
    
    const showPanel = !!parentMessageId || !!profileMemberId;

    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    className="flex-1"
                    autoSaveId='ca-workspace-layout'
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-bgCustom2"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        minSize={20}
                        defaultSize={80}
                    >
                    {children}
                    </ResizablePanel>
                    {
                        showPanel && (
                            <>
                                <ResizableHandle withHandle/>
                                <ResizablePanel
                                    defaultSize={29}
                                    minSize={20}
                                >
                                   {
                                    parentMessageId ? (
                                        <Thread 
                                            messageId={parentMessageId as Id<'messages'>}
                                            onClose={onCloseMessage}
                                        />
                                    ) : profileMemberId ? (
                                        <Profile 
                                            memberId={profileMemberId as Id<'members'>}
                                            onClose={onCloseMessage}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Loader 
                                                className="size-5 animate-spin text-muted-foreground"
                                            />
                                        </div>
                                    )
                                   }
                                </ResizablePanel>
                            </>
                        )
                    }
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
export default WorkspaceLayout;