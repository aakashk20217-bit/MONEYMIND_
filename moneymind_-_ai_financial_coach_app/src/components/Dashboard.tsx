import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export function Dashboard() {
  const userProfile = useQuery(api.users.getUserProfile);
  const connectedAccounts = useQuery(api.users.getConnectedAccounts) || [];
  const goals = useQuery(api.goals.getFinancialGoals) || [];
  const investments = useQuery(api.investments.getInvestmentCalculations) || [];
  const nudges = useQuery(api.nudges.getSmartNudges) || [];
  const transactions = useQuery(api.transactions.getTransactions, { limit: 10 }) || [];
  const spendingByCategory = useQuery(api.transactions.getSpendingByCategory) || [];

  // Calculate totals from actual transactions
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = connectedAccounts.reduce((sum, account) => sum + account.balance, 0);
  const completedGoals = goals.filter(goal => goal.status === "completed").length;
  const activeGoals = goals.filter(goal => goal.status === "active").length;
  const unreadNudges = nudges.filter(nudge => !nudge.isRead).length;

  // Use actual spending data if available, otherwise fall back to sample data
  const monthlySpending = spendingByCategory.length > 0 
    ? spendingByCategory.map((item, index) => ({
        category: item.category,
        amount: item.amount,
        percentage: Math.round((item.amount / totalExpenses) * 100) || 0,
        trend: "stable" as const
      }))
    : [
        { category: "Food & Dining", amount: 15000, percentage: 25, trend: "up" as const },
        { category: "Transportation", amount: 8000, percentage: 13, trend: "down" as const },
        { category: "Shopping", amount: 12000, percentage: 20, trend: "up" as const },
        { category: "Bills & Utilities", amount: 18000, percentage: 30, trend: "stable" as const },
        { category: "Entertainment", amount: 7000, percentage: 12, trend: "down" as const },
      ];

  const displayTotalSpending = spendingByCategory.length > 0 
    ? totalExpenses 
    : monthlySpending.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userProfile?.firstName || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's your financial overview for this month
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{totalBalance.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.2% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Spending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{displayTotalSpending.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {totalIncome > 0 ? `${Math.round((displayTotalSpending / totalIncome) * 100)}% of income` : "Track your spending"}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeGoals}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Target className="w-4 h-4 mr-1" />
                  {completedGoals} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Insights</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadNudges}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spending Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Spending Breakdown</h2>
                <PieChart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {monthlySpending.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${index * 72}, 70%, 50%)` 
                        }}
                      />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.percentage}%
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ₹{item.amount.toLocaleString()}
                      </span>
                      {item.trend === "up" && (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      )}
                      {item.trend === "down" && (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {spendingByCategory.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="mb-2">No spending data yet</p>
                  <p className="text-sm">Add transactions to see your spending breakdown</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Recent Goals */}
          <div className="space-y-6">
            {/* Connected Accounts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Connected Accounts
              </h3>
              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div key={account._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {account.accountName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {account.accountNumber}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      account.balance >= 0 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      ₹{Math.abs(account.balance).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Goals
              </h3>
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {goal.name}
                        </span>
                        {goal.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>₹{goal.currentAmount.toLocaleString()}</span>
                        <span>₹{goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                
                {goals.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    No goals set yet. Create your first goal to start tracking progress.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Investments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Calculations
              </h3>
              <div className="space-y-3">
                {investments.slice(0, 3).map((investment) => (
                  <div key={investment._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {investment.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {investment.type} • {investment.duration} months
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ₹{investment.maturityAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
                
                {investments.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    No investment calculations yet. Try the investment calculator.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
