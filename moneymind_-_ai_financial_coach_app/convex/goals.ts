import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createFinancialGoal = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.string(),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate feasibility and suggested savings
    const deadlineDate = new Date(args.deadline);
    const currentDate = new Date();
    const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    const remainingAmount = args.targetAmount - args.currentAmount;
    const suggestedMonthlySavings = Math.ceil(remainingAmount / monthsRemaining);
    
    let feasibility = "High";
    if (suggestedMonthlySavings > 50000) feasibility = "Low";
    else if (suggestedMonthlySavings > 25000) feasibility = "Medium";

    return await ctx.db.insert("financialGoals", {
      userId,
      ...args,
      feasibility,
      suggestedMonthlySavings,
      status: "active",
    });
  },
});

export const getFinancialGoals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("financialGoals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const updateGoalProgress = mutation({
  args: {
    goalId: v.id("financialGoals"),
    newCurrentAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== userId) {
      throw new Error("Goal not found");
    }

    const status = args.newCurrentAmount >= goal.targetAmount ? "completed" : "active";

    await ctx.db.patch(args.goalId, {
      currentAmount: args.newCurrentAmount,
      status,
    });
  },
});
