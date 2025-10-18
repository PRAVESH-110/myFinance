"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Income</p>
          <p className="text-2xl font-semibold text-green-700">₹{totalIncome}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">Expense</p>
          <p className="text-2xl font-semibold text-red-700">₹{totalExpense}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-2xl font-semibold text-blue-700">₹{balance}</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <TransactionForm onAdded={fetchTransactions} />

      {/* Transaction List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
}
