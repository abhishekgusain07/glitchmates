interface WorkspacePageProps {
    params: {
        workspaceId: string;
    }
}

const WorkspacePage = ({params}: WorkspacePageProps) => {
    return (
        <div>
            <h1>Workspace {params.workspaceId}</h1>
        </div>
    )
}

export default WorkspacePage;