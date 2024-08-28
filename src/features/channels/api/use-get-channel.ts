import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import type { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelsProps {
    id: Id<"channels">;
}
 
export const useGetChannel = ({id}: UseGetChannelsProps) => {
    const data = useQuery(api.channels.getById, {
        id
    })
    const isLoading = data === undefined;
    return {
        data,
        isLoading
    }
}