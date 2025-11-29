import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    monthlyIncome: v.optional(v.number()),
    currency: v.optional(v.string()),
    riskTolerance: v.optional(v.string()),
    financialGoals: v.optional(v.array(v.string())),
    onboardingCompleted: v.boolean(),
  }).index("by_user", ["userId"]),

  connectedAccounts: defineTable({
    userId: v.id("users"),
    accountType: v.string(), // "bank", "card", "investment"
    accountName: v.string(),
    balance: v.number(),
    accountNumber: v.string(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),

  investmentCalculations: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.string(), // "FD", "RD", "SIP", "custom"
    amount: v.number(),
    duration: v.number(), // in months
    rate: v.number(),
    maturityAmount: v.number(),
    aiInsights: v.string(),
    chartData: v.string(), // JSON string
  }).index("by_user", ["userId"]),

  financialGoals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.string(),
    priority: v.string(), // "high", "medium", "low"
    feasibility: v.string(),
    suggestedMonthlySavings: v.number(),
    status: v.string(), // "active", "completed", "paused"
  }).index("by_user", ["userId"]),

  smartNudges: defineTable({
    userId: v.id("users"),
    type: v.string(), // "overspending", "saving", "debt", "investment"
    message: v.string(),
    isRead: v.boolean(),
    priority: v.string(),
    actionable: v.boolean(),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.string(), // "income" or "expense"
    category: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.string(),
    accountId: v.optional(v.id("connectedAccounts")),
  }).index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_and_type", ["userId", "type"]),

  spendingData: defineTable({
    userId: v.id("users"),
    category: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.string(),
    accountId: v.id("connectedAccounts"),
  }).index("by_user", ["userId"]),

  budgets: defineTable({
    userId: v.id("users"),
    category: v.string(),
    budgetAmount: v.number(),
    spentAmount: v.number(),
    month: v.string(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
