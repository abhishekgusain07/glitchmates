import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


const schema = defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("users"),
        joinCode: v.string(),
    }),
    members: defineTable({
        userId: v.id("users"),
        workspaceId: v.id("workspaces"),
        role: v.union(v.literal("admin"), v.literal("member")),
    })
        .index("by_user_id", ['userId'])
        .index("by_workspace_id", ['workspaceId'])
        .index("by_workspace_id_user_id", ['workspaceId', 'userId']),

    channels: defineTable({
        name: v.string(),
        workspaceId: v.id("workspaces"),
    })
        .index("by_workspace_id", ['workspaceId']),
    conversations: defineTable({
        workspaceId: v.id("workspaces"),
        memberOneId: v.id("members"),
        memberTwoId: v.id("members"),
    })
        .index("by_workspace_id", ['workspaceId']),

    messages: defineTable({
        channelId: v.optional(v.id("channels")),
        body: v.string(),
        // The v.id("_storage") suggests that the image is stored in Convex's storage system,
        // and we're referencing it by its storage ID.
        memberId: v.id("members"),
        workspaceId: v.id("workspaces"),
        image: v.optional(v.id("_storage")),
        //can be reply to a message
        parentMessageId: v.optional(v.id("messages")),
        updatedAt: v.optional(v.number()),
        conversationId: v.optional(v.id("conversations")),
    })
        .index("by_workspace_id", ['workspaceId'])
        .index("by_channel_id", ['channelId'])
        .index("by_member_id", ['memberId'])
        .index("by_parent_message_id", ['parentMessageId'])
        .index("by_conversation_id", ['conversationId'])
        .index("by_channel_id_parent_message_id_converation_id",["channelId","parentMessageId","conversationId"]),
    
    reactions: defineTable({
        workspaceId: v.id("workspaces"),
        messageId: v.id("messages"),
        memberId: v.id("members"),
        value: v.string(),
    })
        .index("by_workspace_id", ['workspaceId'])
        .index("by_message_id", ['messageId'])
        .index("by_member_id", ['memberId'])
});

export default schema;