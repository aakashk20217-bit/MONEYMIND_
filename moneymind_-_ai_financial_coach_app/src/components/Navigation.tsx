import { SignOutButton } from "../SignOutButton";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, Home, BarChart3, Target, Lightbulb, PieChart, CreditCard } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: PieChart },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "investments", label: "Investments", icon: BarChart3 },
    { id: "goals", label: "Goals", icon: Target },
    { id: "nudges", label: "Smart Nudges", icon: Lightbulb },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MoneyMind</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Light</span>
                </>
              )}
            </button>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
