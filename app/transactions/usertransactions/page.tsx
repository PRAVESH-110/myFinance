"use client";

import React, { useState, useEffect } from 'react';

interface Transaction {
  _id: string;
  title: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  // Add other properties that your transaction objects have
}

export default function UserTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== UserTransactions Component Mounted ===');
    const fetchUserTransactions = async () => {
      try {
        console.log('=== FETCH USER TRANSACTIONS STARTED ===');
        
        // Check for token in multiple possible locations
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('userToken') ||
                     sessionStorage.getItem('token');
        
        console.log('Auth token from storage:', token ? 'Token found' : 'No token found');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const requestUrl = 'http://localhost:5000/api/v1/user/usertransaction';
        console.log('Making request to:', requestUrl);
        
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        
        // Check if response is HTML (which would indicate a login page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const responseText = await response.text();
          console.error('Received HTML response instead of JSON:', responseText.substring(0, 500));
          throw new Error('Authentication required. Please log in again.');
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response from server:', errorData);
          throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (!response.ok) {
          const errorMessage = responseData.message || response.statusText || 'Unknown error';
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            message: errorMessage,
            responseData
          });
          
          if (response.status === 401 || response.status === 403) {
            // Clear any existing tokens on auth errors
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            throw new Error('Your session has expired. Please log in again.');
          }
          
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }

        // Handle different possible response formats
        const transactionsData = responseData.purchases || responseData.transactions || [];
        
        if (!Array.isArray(transactionsData)) {
          throw new Error('Invalid transactions data format received from server');
        }

        setTransactions(transactionsData);
        
      } catch (error) {
        const err = error as Error & { response?: any };
        console.error('Error fetching user transactions:', err);
        setError(err.message || 'Failed to load user transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Transactions</h1>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}