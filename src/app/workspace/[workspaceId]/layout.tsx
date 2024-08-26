"use client";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}
const WorkspaceLayout = ({children}: WorkSpaceIdLayoutProps) => { 
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
                        className="bg-[#5E2C5F]"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        minSize={20}
                    >
                    {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
export default WorkspaceLayout;