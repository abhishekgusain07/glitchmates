import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { v } from "convex/values";
import type{ Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfoProps {
    id: Id<"workspaces">;
}
export const useGetWorkspaceInfo = ({id}: UseGetWorkspaceInfoProps) => {
    const data = useQuery(api.workspaces.getInfoById, {id});
    const isLoading = data === undefined;
    return {data, isLoading};
}