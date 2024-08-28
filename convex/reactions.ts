import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { mutation, type QueryCtx } from "./_generated/server"
import { auth } from "./auth"

 

const getMember = async(ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique()
}

export const toggle = mutation({
    args: {
        messageId: v.id("messages"),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            throw new Error("Unauthorized")
        }
        
        const message = await ctx.db.get(args.messageId)
        if(!message){
            throw new Error("Message not found")
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if(!member){
            throw new Error("Member not found")
        }

        const existingReaction = await ctx.db
        .query("reactions")
        .filter((q) =>
        q.and(
            q.eq(q.field("messageId"), args.messageId),
            q.eq(q.field("memberId"), member._id),
            q.eq(q.field("value"), args.value)
        ))
        .first()

        if(existingReaction){
            await ctx.db.delete(existingReaction._id)
            return existingReaction._id;
        }

        const newReactionId = await ctx.db.insert("reactions", {
            messageId: message._id,
            memberId: member._id,
            value: args.value,
            workspaceId: message.workspaceId,
        });
        return newReactionId;
    } 
}) 