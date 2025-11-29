import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArrowRight, ArrowLeft, User, DollarSign, Target, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    monthlyIncome: "",
    currency: "INR",
    riskTolerance: "",
    financialGoals: [] as string[],
  });

  const createProfile = useMutation(api.users.createUserProfile);
  const addAccount = useMutation(api.users.addConnectedAccount);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  const handleComplete = async () => {
    try {
      await createProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        monthlyIncome: parseInt(formData.monthlyIncome),
        currency: formData.currency,
        riskTolerance: formData.riskTolerance,
        financialGoals: formData.financialGoals,
      });

      // Add sample accounts
      await addAccount({
        accountType: "bank",
        accountName: "HDFC Savings Account",
        balance: 125000,
        accountNumber: "****1234",
      });

      await addAccount({
        accountType: "card",
        accountName: "HDFC Credit Card",
        balance: -15000,
        accountNumber: "****5678",
      });

      toast.success("Profile created successfully!");
      onComplete();
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const goals = [
    "Emergency Fund",
    "Home Purchase",
    "Car Purchase",
    "Education",
    "Retirement",
    "Travel",
    "Investment Growth",
    "Debt Payoff"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to MoneyMind</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Financial Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Help us understand your financial situation</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter monthly income"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Conservative", "Moderate", "Aggressive"].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setFormData(prev => ({ ...prev, riskTolerance: risk }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.riskTolerance === risk
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Financial Goals</h2>
              <p className="text-gray-600 dark:text-gray-300">Select your primary financial objectives</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.financialGoals.includes(goal)
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-300 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account Setup</h2>
              <p className="text-gray-600 dark:text-gray-300">We'll set up sample accounts for you to get started</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Sample Accounts</h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <li>• HDFC Savings Account - ₹1,25,000</li>
                  <li>• HDFC Credit Card - ₹15,000 (outstanding)</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In a real application, you would connect your actual bank accounts securely. For this demo, we're using simulated data.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.firstName || !formData.lastName)) ||
                (step === 2 && (!formData.monthlyIncome || !formData.riskTolerance)) ||
                (step === 3 && formData.financialGoals.length === 0)
              }
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
