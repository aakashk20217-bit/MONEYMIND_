import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addTransaction = mutation({
  args: {
    type: v.string(), // "income" or "expense"
    category: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.string(),
    accountId: v.optional(v.id("connectedAccounts")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("transactions", {
      userId,
      ...args,
    });
  },
});

export const getTransactions = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.type) {
      query = ctx.db
        .query("transactions")
        .withIndex("by_user_and_type", (q) => 
          q.eq("userId", userId).eq("type", args.type!)
        );
    }

    return await query
      .order("desc")
      .take(args.limit || 50);
  },
});

export const getTransactionsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .order("desc")
      .collect();
  },
});

export const deleteTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transaction not found");
    }

    await ctx.db.delete(args.transactionId);
  },
});

export const getSpendingByCategory = query({
  args: {
    month: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const currentMonth = args.month || new Date().toISOString().slice(0, 7);
    const startDate = `${currentMonth}-01`;
    const endDate = `${currentMonth}-31`;

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user_and_type", (q) => 
        q.eq("userId", userId).eq("type", "expense")
      )
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();

    // Group by category
    const categoryTotals: Record<string, number> = {};
    transactions.forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
  },
});
