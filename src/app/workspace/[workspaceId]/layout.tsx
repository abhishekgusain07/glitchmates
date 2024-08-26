"use client";
import Toolbar from "./toolbar";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}
const WorkspaceLayout = ({children}: WorkSpaceIdLayoutProps) => {
    return (
        <div className="h-full">
            <Toolbar />
            {children}
        </div>
    )
}
export default WorkspaceLayout;