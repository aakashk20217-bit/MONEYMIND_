import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Bell, AlertTriangle, TrendingUp, CreditCard, Target, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function SmartNudges() {
  const nudges = useQuery(api.nudges.getSmartNudges) || [];
  const generateNudges = useAction(api.nudges.generateSmartNudges);
  const markAsRead = useMutation(api.nudges.markNudgeAsRead);

  const handleGenerateNudges = async () => {
    try {
      await generateNudges({});
      toast.success("New insights generated!");
    } catch (error) {
      toast.error("Failed to generate insights");
    }
  };

  const handleMarkAsRead = async (nudgeId: any) => {
    try {
      await markAsRead({ nudgeId });
    } catch (error) {
      toast.error("Failed to update nudge");
    }
  };

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case "overspending": return AlertTriangle;
      case "saving": return TrendingUp;
      case "debt": return CreditCard;
      case "investment": return Target;
      default: return Bell;
    }
  };

  const getNudgeColor = (type: string, priority: string) => {
    if (priority === "high") {
      return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
    }
    
    switch (type) {
      case "overspending": return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
      case "saving": return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "debt": return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      case "investment": return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
      default: return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800";
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === "high") return "text-red-600 dark:text-red-400";
    
    switch (type) {
      case "overspending": return "text-orange-600 dark:text-orange-400";
      case "saving": return "text-green-600 dark:text-green-400";
      case "debt": return "text-red-600 dark:text-red-400";
      case "investment": return "text-blue-600 dark:text-blue-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "low": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const unreadCount = nudges.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart Nudges</h1>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered insights to optimize your financial decisions
            </p>
            {unreadCount > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Bell className="w-4 h-4 mr-1" />
                  {unreadCount} new insight{unreadCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleGenerateNudges}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate Insights</span>
          </button>
        </div>

        {/* Nudges Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Overspending</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {nudges.filter(n => n.type === "overspending").length} alerts
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Savings</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {nudges.filter(n => n.type === "saving").length} tips
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Investment</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {nudges.filter(n => n.type === "investment").length} opportunities
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <CreditCard className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Debt</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {nudges.filter(n => n.type === "debt").length} reminders
            </p>
          </div>
        </div>

        {/* Nudges List */}
        <div className="space-y-4">
          {nudges.map((nudge) => {
            const Icon = getNudgeIcon(nudge.type);
            const colorClasses = getNudgeColor(nudge.type, nudge.priority);
            const iconColor = getIconColor(nudge.type, nudge.priority);
            const priorityBadge = getPriorityBadge(nudge.priority);

            return (
              <div
                key={nudge._id}
                className={`border-2 rounded-2xl p-6 transition-all hover:shadow-lg ${colorClasses} ${
                  nudge.isRead ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityBadge}`}>
                          {nudge.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {nudge.type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      {!nudge.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(nudge._id)}
                          className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-900 dark:text-white leading-relaxed mb-3">
                      {nudge.message}
                    </p>
                    
                    {nudge.actionable && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">💡 Actionable insight</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {nudges.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Insights Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate your first AI-powered financial insights to get personalized recommendations
              </p>
              <button
                onClick={handleGenerateNudges}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Generate Insights
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
