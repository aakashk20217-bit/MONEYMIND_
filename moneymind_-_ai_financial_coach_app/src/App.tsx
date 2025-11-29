import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { InvestmentInsights } from "./components/InvestmentInsights";
import { GoalPlanning } from "./components/GoalPlanning";
import { SmartNudges } from "./components/SmartNudges";
import { TransactionManager } from "./components/TransactionManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navigation } from "./components/Navigation";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Toaster />
        <Content />
      </div>
    </ThemeProvider>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);
  const [currentPage, setCurrentPage] = useState("home");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        {!userProfile?.onboardingCompleted ? (
          <OnboardingFlow onComplete={() => window.location.reload()} />
        ) : (
          <>
            <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
            <main className="pt-16">
              {currentPage === "home" && <HomePage />}
              {currentPage === "dashboard" && <Dashboard />}
              {currentPage === "transactions" && <TransactionManager />}
              {currentPage === "investments" && <InvestmentInsights />}
              {currentPage === "goals" && <GoalPlanning />}
              {currentPage === "nudges" && <SmartNudges />}
            </main>
          </>
        )}
      </Authenticated>

      <Unauthenticated>
        <HomePage />
      </Unauthenticated>
    </>
  );
}
