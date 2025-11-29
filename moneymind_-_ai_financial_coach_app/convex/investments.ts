import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveInvestmentCalculation = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    amount: v.number(),
    duration: v.number(),
    rate: v.number(),
    maturityAmount: v.number(),
    aiInsights: v.string(),
    chartData: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("investmentCalculations", {
      userId,
      ...args,
    });
  },
});

export const getInvestmentCalculations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("investmentCalculations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const generateInvestmentInsights = action({
  args: {
    type: v.string(),
    amount: v.number(),
    duration: v.number(),
    rate: v.number(),
    maturityAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const { type, amount, duration, rate, maturityAmount } = args;
    const totalReturns = maturityAmount - amount;
    const annualizedReturn = ((maturityAmount / amount) ** (12 / duration) - 1) * 100;

    let insights = `Your ${type} investment of ₹${amount.toLocaleString()} over ${duration} months at ${rate}% will mature to ₹${maturityAmount.toLocaleString()}. `;
    
    if (type === "SIP") {
      insights += `With systematic investing, you're building wealth gradually while benefiting from rupee cost averaging. `;
    } else if (type === "FD") {
      insights += `Fixed deposits offer guaranteed returns with capital protection. `;
    } else if (type === "RD") {
      insights += `Recurring deposits help build disciplined saving habits with assured returns. `;
    }

    insights += `Your total returns will be ₹${totalReturns.toLocaleString()} with an effective annual return of ${annualizedReturn.toFixed(2)}%. `;

    if (annualizedReturn > 8) {
      insights += "This is an excellent return that beats inflation significantly.";
    } else if (annualizedReturn > 6) {
      insights += "This provides moderate returns that should keep pace with inflation.";
    } else {
      insights += "Consider exploring higher-yield options for better long-term wealth creation.";
    }

    return insights;
  },
});
