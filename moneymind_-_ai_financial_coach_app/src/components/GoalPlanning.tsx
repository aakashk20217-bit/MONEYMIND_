import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Target, Plus, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function GoalPlanning() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    priority: "medium",
  });

  const goals = useQuery(api.goals.getFinancialGoals) || [];
  const createGoal = useMutation(api.goals.createFinancialGoal);
  const updateProgress = useMutation(api.goals.updateGoalProgress);

  const handleCreateGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createGoal({
        name: newGoal.name,
        targetAmount: parseInt(newGoal.targetAmount),
        currentAmount: parseInt(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline,
        priority: newGoal.priority,
      });

      toast.success("Goal created successfully!");
      setShowCreateModal(false);
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        priority: "medium",
      });
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "1 day left";
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Goal Planning</h1>
            <p className="text-gray-600 dark:text-gray-300">Set and track your financial goals with AI-powered insights</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Target</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const timeRemaining = getTimeRemaining(goal.deadline);
            
            return (
              <div key={goal._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.toUpperCase()}
                    </span>
                    {goal.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{goal.currentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Target Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{timeRemaining}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Feasibility</p>
                      <p className={`text-sm font-medium ${getFeasibilityColor(goal.feasibility)}`}>
                        {goal.feasibility}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Save ₹{goal.suggestedMonthlySavings.toLocaleString()} monthly to reach your goal on time.
                      {goal.feasibility === "Low" && " Consider extending the deadline or reducing the target amount."}
                      {goal.feasibility === "High" && " You're on track to achieve this goal comfortably!"}
                    </p>
                  </div>

                  {goal.status === "active" && (
                    <button
                      onClick={() => {
                        const newAmount = prompt("Enter current amount:", goal.currentAmount.toString());
                        if (newAmount && !isNaN(parseInt(newAmount))) {
                          updateProgress({
                            goalId: goal._id,
                            newCurrentAmount: parseInt(newAmount),
                          });
                        }
                      }}
                      className="w-full bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Update Progress
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Goals Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start by creating your first financial goal to track your progress
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>

        {/* Create Goal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Goal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Emergency Fund, Dream Home"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="500000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
