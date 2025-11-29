import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const getSmartNudges = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("smartNudges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const generateSmartNudges = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Simulate AI-generated nudges based on spending patterns
    const nudges = [
      {
        type: "overspending",
        message: "You've spent 15% more on dining out this month. Consider cooking at home 2-3 times this week to save ₹2,000.",
        priority: "medium",
        actionable: true,
      },
      {
        type: "saving",
        message: "Great job! You're ahead of your savings goal by ₹5,000 this month. Consider investing the extra amount in a SIP.",
        priority: "low",
        actionable: true,
      },
      {
        type: "investment",
        message: "Your emergency fund is well-stocked. It's a good time to explore equity mutual funds for higher returns.",
        priority: "high",
        actionable: true,
      },
      {
        type: "debt",
        message: "Pay off your credit card balance of ₹15,000 before the due date to avoid interest charges of ₹2,250.",
        priority: "high",
        actionable: true,
      },
    ];

    // Insert random nudges (in a real app, this would be based on actual spending analysis)
    const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];
    
    await ctx.runMutation(internal.nudges.createNudge, {
      ...randomNudge,
    });
  },
});

export const createNudge = internalMutation({
  args: {
    type: v.string(),
    message: v.string(),
    priority: v.string(),
    actionable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("smartNudges", {
      userId,
      ...args,
      isRead: false,
    });
  },
});

export const markNudgeAsRead = mutation({
  args: {
    nudgeId: v.id("smartNudges"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.nudgeId, { isRead: true });
  },
});
