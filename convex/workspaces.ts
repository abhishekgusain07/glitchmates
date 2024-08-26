import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";


const generateJoinCode = () => {
    const code = Array.from({length: 6}, () => 
        "0123456789abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 36))
    ).join("");
    return code;
}
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            return []
        }
        
        const members = await ctx.db.query("members")
        .withIndex("by_user_id", (q) => q.eq("userId", userId)).collect();
        const workspaceIds = members.map((member) => member.workspaceId);
        const workspaces = []
        for (const workspaceId of workspaceIds){
            const workspace = await ctx.db.get(workspaceId);
            if(workspace){
                workspaces.push(workspace);
            }
        }
        return workspaces;
    }
});

export const create = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            throw new Error("Not authenticated");
        }
        //Todo: proper method to generate join code
        const joinCode = generateJoinCode();

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId
        });
        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin"
        });
        await ctx.db.insert("channels", {
            name: "general",
            workspaceId
        });
        return workspaceId;
    }
})

export const getById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            throw new Error("Not authenticated");
        }
        const member = await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
        .unique();
        if(!member){
            return null;
        }
        return await ctx.db.get(args.id);
    }
})

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            throw new Error("Not authenticated");
        }
        const member = await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
        .unique();

        if(!member || member.role !== "admin"){
            throw new Error("Not authorized");
        }
        await ctx.db.patch(args.id, {
            name: args.name
        });
        return args.id;
    }
})
export const remove = mutation({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId){
            throw new Error("Not authenticated");
        }
        const member = await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
        .unique();

        if(!member || member.role !== "admin"){
            throw new Error("Not authorized");
        }

        //Todo: delete all members of workspace
        const [members] = await Promise.all([
            ctx.db
            .query("members")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
            .collect(),
        ]);

        for(const member of members){
            await ctx.db.delete(member._id);
        }
        await ctx.db.delete(args.id);
        return args.id;
    }
})