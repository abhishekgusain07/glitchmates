import { v } from "convex/values";
// biome-ignore lint/style/useImportType: <explanation>
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import type { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId)
}

const popluateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const messages =  await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect()
    if(messages.length === 0) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0
        }
    }
    const lastMessage = messages[messages.length - 1]
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId)
    if(!lastMessageMember) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0
        };
    }
    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timestamp: lastMessage._creationTime,
    }
}

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db.query("reactions").withIndex("by_message_id", (q) => q.eq("messageId", messageId)).collect()
}

const populateUser = async (ctx: QueryCtx, userId : Id<"users">) => {
    return ctx.db.get(userId)
}



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


export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)

        if(!userId) {
            throw new Error('Unauthorized')
        }

        let _conversationId = args.conversationId

        if(!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)

            if(!parentMessage) {
                throw new Error('Parent message not found')
            }

            _conversationId = parentMessage?.conversationId
        }
        const result = await ctx.db
        .query("messages")
        .withIndex("by_channel_id_parent_message_id_converation_id", (q) => 
            q
                .eq("channelId", args.channelId)
                .eq("parentMessageId", args.parentMessageId)
                .eq("conversationId", _conversationId))
        .order("desc")
        .paginate(args.paginationOpts); 

        return {
            ...result,
            page: (
                await Promise.all(
                    result.page.map(async (message) => {
                    const member = await populateMember(ctx, message.memberId)
                    const user = member ? await populateUser(ctx, member.userId) : null

                    if(!member || !user) {
                        return null;
                    }

                    const reactions = await populateReactions(ctx, message._id)
                    const thread = await popluateThread(ctx, message._id)
                    const image = message.image ? await ctx.storage.getUrl(message.image) : undefined

                    const reactionsWithCount = reactions.map((reaction) => {
                        return {
                            ...reaction,
                            count: reactions.filter((r) => r.value === reaction.value).length
                        }
                    })
                    const dedupedReactions = reactionsWithCount.reduce((acc, reaction) => {
                        const existingReaction = acc.find((r) => r.value === reaction.value)
                        if (existingReaction) {
                            existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                        } else {
                            acc.push({
                                ...reaction,
                                memberIds: [reaction.memberId]
                            })
                        }
                        return acc;

                    }, [] as (Doc<"reactions"> & {
                        count: number;
                        memberIds: Id<"members">[];
                    })[])

                    const reactionWithoutMemberIdProperty =dedupedReactions.map(({ memberId, ...rest }) => rest)

                    return {
                        ...message,
                        reactions: reactionWithoutMemberIdProperty,
                        user,
                        image,
                        threadCount: thread.count,
                        threadImag: thread.image,
                        threadTimestamp: thread.timestamp,
                        member
                    }
                }))
            ).filter((message): message is NonNullable<typeof message> => message !== null)
        }
    }
})

export const create = mutation({
    args: {
        body: v.string(),
        workspaceId: v.id("workspaces"),
        image: v.optional(v.id("_storage")),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationalId: v.optional(v.id("conversations")),
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

        let _conversationalId = args.conversationalId
        
        // only possible when we are replying inside a thread 1 on 1 chat
        if(!args.conversationalId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)
            
            if(!parentMessage) {
                throw new Error('Parent message not found')
            }

            _conversationalId = parentMessage.conversationId
            
        }




        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            workspaceId: args.workspaceId,
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            conversationId: _conversationalId,
            parentMessageId: args.parentMessageId,
        })

        return messageId;
    }
})
