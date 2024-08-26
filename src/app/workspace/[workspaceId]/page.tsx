"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
 

const WorkspacePage = () => {
    const workspaceId = useWorkspaceId();
    const {data, isLoading} = useGetWorkspace({id: workspaceId});
    return (
        <div>
            <h1>Data: {JSON.stringify(data)}</h1>
        </div>
    )
}

export default WorkspacePage;