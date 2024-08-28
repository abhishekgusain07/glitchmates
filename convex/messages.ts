import { v } from "convex/values";
// biome-ignore lint/style/useImportType: <explanation>
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import type { Id } from "./_generated/dataModel";


const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
}

export const create = mutation({
    args: {
        body: v.string(),
        workspaceId: v.id("workspaces"),
        image: v.optional(v.id("_storage")),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        //todo: add conversationalId
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)

        if(!userId) {
            throw new Error('Unauthorized')
        }

        const member = await getMember(ctx, args.workspaceId, userId);

        if(!member) {
            throw new Error('Member not found')
        }

        //todo: handle conversationalId

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            workspaceId: args.workspaceId,
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            updatedAt: Date.now(),
            parentMessageId: args.parentMessageId,
        })

        return messageId;
    }
})