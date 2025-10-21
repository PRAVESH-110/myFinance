'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Balance</h3>
            <p className="text-3xl font-bold">$0.00</p>
          </div>

          {/* Income Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">This Month's Income</h3>
            <p className="text-3xl font-bold text-green-600">$0.00</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">This Month's Expenses</h3>
            <p className="text-3xl font-bold text-red-600">$0.00</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        </div>
      </div>
    </div>
  );
}