import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";


export const create = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        name: v.string(), 
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            throw new Error("Unauthorized");
        }
        const members = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
        .unique();
        
        if(!members || members.role !== "admin"){
            throw new Error("Unauthorized");
        }
        
        const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

        const channelId = await ctx.db.insert("channels", {
            name: parsedName,
            workspaceId: args.workspaceId,
        }) 
        
        return channelId;
    }
})

export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            return []
        }
        const members = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
        .unique();

        if(!members){
            return []
        }
        const channels = await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect();
        
        return channels;
    }
});


