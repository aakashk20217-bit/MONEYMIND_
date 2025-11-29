import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Filter,
  FileText
} from "lucide-react";
import { toast } from "sonner";

export function TransactionManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });

  const transactions = useQuery(api.transactions.getTransactions, {
    limit: 100,
    type: filterType === "all" ? undefined : filterType,
  }) || [];

  const spendingByCategory = useQuery(api.transactions.getSpendingByCategory) || [];
  const addTransaction = useMutation(api.transactions.addTransaction);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const expenseCategories = [
    "Food & Dining", "Transportation", "Shopping", "Bills & Utilities", 
    "Entertainment", "Healthcare", "Education", "Travel", "Other"
  ];

  const incomeCategories = [
    "Salary", "Freelance", "Business", "Investment Returns", 
    "Rental Income", "Bonus", "Gift", "Other"
  ];

  const handleAddTransaction = async () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addTransaction({
        type: newTransaction.type,
        category: newTransaction.category,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date,
        description: newTransaction.description,
      });

      toast.success("Transaction added successfully!");
      setShowAddModal(false);
      setNewTransaction({
        type: "expense",
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      });
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction({ transactionId });
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected CSV format: date,type,category,amount,description
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 5) {
          try {
            await addTransaction({
              date: values[0].trim(),
              type: values[1].trim().toLowerCase(),
              category: values[2].trim(),
              amount: parseFloat(values[3].trim()),
              description: values[4].trim(),
            });
          } catch (error) {
            console.error(`Error adding transaction from line ${i + 1}:`, error);
          }
        }
      }
      toast.success("CSV uploaded successfully!");
    };
    reader.readAsText(file);
  };

  const downloadCSV = () => {
    const csvContent = [
      "Date,Type,Category,Amount,Description",
      ...transactions.map(t => 
        `${t.date},${t.type},${t.category},${t.amount},"${t.description}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("CSV downloaded successfully!");
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Transaction Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your income and expenses with detailed insights
            </p>
          </div>
          <div className="flex space-x-3">
            <label className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={downloadCSV}
              className="bg-gray-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                <p className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  ₹{(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.type === "income" 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {transaction.type === "income" ? (
                          <TrendingUp className={`w-5 h-5 ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`} />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-semibold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Add your first transaction to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Spending by Category
              </h3>
              <div className="space-y-3">
                {spendingByCategory.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${index * 45}, 70%, 50%)` 
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}

                {spendingByCategory.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    No spending data for this month
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                CSV Upload Format
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>Upload a CSV file with the following columns:</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-mono text-xs">
                  date,type,category,amount,description
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>date:</strong> YYYY-MM-DD format</li>
                  <li>• <strong>type:</strong> "income" or "expense"</li>
                  <li>• <strong>category:</strong> Category name</li>
                  <li>• <strong>amount:</strong> Numeric value</li>
                  <li>• <strong>description:</strong> Transaction description</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Add Transaction
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["income", "expense"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewTransaction(prev => ({ 
                          ...prev, 
                          type, 
                          category: "" 
                        }))}
                        className={`p-3 rounded-xl border-2 transition-all capitalize ${
                          newTransaction.type === type
                            ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {(newTransaction.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
