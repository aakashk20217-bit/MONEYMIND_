import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "../SignInForm";
import { ArrowRight, Shield, TrendingUp, Target, Brain, Bell, Star } from "lucide-react";

export function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "Smart Budgeting",
      description: "AI-powered budget recommendations based on your spending patterns and financial goals."
    },
    {
      icon: TrendingUp,
      title: "Adaptive Savings",
      description: "Dynamic savings strategies that adjust to your lifestyle and income changes."
    },
    {
      icon: Target,
      title: "Investment Insights",
      description: "Personalized investment recommendations with risk assessment and portfolio optimization."
    },
    {
      icon: Shield,
      title: "Goal Planning",
      description: "Set and track financial goals with AI-calculated timelines and feasibility analysis."
    },
    {
      icon: Bell,
      title: "AI Nudges",
      description: "Smart notifications and actionable insights to keep you on track with your finances."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "MoneyMind helped me save ₹2 lakhs in just 8 months through smart budgeting and investment insights.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "The AI nudges are incredibly helpful. I've optimized my spending and increased my savings by 40%.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Marketing Manager",
      content: "Finally achieved my dream home goal 2 years early thanks to MoneyMind's goal planning feature.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Money<span className="text-green-600">Mind</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Your Adaptive AI Financial Coach
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform your financial future with personalized insights, smart budgeting, and AI-powered recommendations tailored to your unique goals.
            </p>
            
            <Unauthenticated>
              <div className="max-w-md mx-auto">
                <SignInForm />
              </div>
            </Unauthenticated>

            <Authenticated>
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Authenticated>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Your Financial Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive tools to help you make smarter financial decisions and achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands of Users
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how MoneyMind has transformed financial lives across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already started their journey to financial freedom with MoneyMind.
          </p>
          
          <Unauthenticated>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
          </Unauthenticated>

          <Authenticated>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto">
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Authenticated>
        </div>
      </section>
    </div>
  );
}
