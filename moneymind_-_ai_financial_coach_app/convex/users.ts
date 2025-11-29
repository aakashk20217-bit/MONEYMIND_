import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const createUserProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    monthlyIncome: v.number(),
    currency: v.string(),
    riskTolerance: v.string(),
    financialGoals: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...args,
        onboardingCompleted: true,
      });
      return existingProfile._id;
    }

    return await ctx.db.insert("userProfiles", {
      userId,
      ...args,
      onboardingCompleted: true,
    });
  },
});

export const getConnectedAccounts = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("connectedAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const addConnectedAccount = mutation({
  args: {
    accountType: v.string(),
    accountName: v.string(),
    balance: v.number(),
    accountNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("connectedAccounts", {
      userId,
      ...args,
      isActive: true,
    });
  },
});
