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
        updatedAt: v.number(),

        //todo conversationalId
    })
    
});

export default schema;