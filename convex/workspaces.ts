import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const get = query({
    args: {},
    handler: async (ctx) => {
       return await ctx.db.query("workspaces").collect()
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
        const joinCode = "123456"

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId
        });
        return workspaceId;
    }
})