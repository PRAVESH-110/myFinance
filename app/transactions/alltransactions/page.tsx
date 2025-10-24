'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../../config/setup';

interface Transaction {
  _id: string;
  title: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  // Add other properties that your transaction objects have
}

export default function AllTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchTransactions = async () => {
      try {
        console.log('=== FETCH TRANSACTIONS STARTED ===');
        const token = localStorage.getItem('adminToken');
        console.log('Admin token from localStorage:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const requestUrl = 'http://localhost:5000/api/v1/transaction/bulk';
        console.log('=== REQUEST DETAILS ===');
        console.log('URL:', requestUrl);
        console.log('Method: GET');
        console.log('Headers:', {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        
        let response;
        try {
          response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include' // Important for cookies if using them
          });
        } catch (error) {
          const fetchError = error as Error;
          console.error('Fetch error:', fetchError);
          throw new Error(`Network error: ${fetchError.message}`);
        }
        
        console.log('=== RESPONSE DETAILS ===');
        console.log('Status:', response.status, response.statusText);
        
        // Try to parse response as JSON, but fall back to text if it fails
        let responseData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          console.log('Response data:', responseData);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Failed to parse server response');
        }

        if (!response.ok) {
          const errorMessage = responseData.message || response.statusText || 'Unknown error';
          console.error('Server error:', {
            status: response.status,
            statusText: response.statusText,
            error: responseData
          });
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }

        // If we get here, the request was successful
        console.log('Success:', responseData);
        
        // Check if the expected data structure is present
        if (!responseData.courses && !Array.isArray(responseData)) {
          console.warn('Unexpected response format:', responseData);
          setTransactions(Array.isArray(responseData) ? responseData : []);
        } else {
          setTransactions(responseData.courses || responseData || []);
        }
      } catch (error) {
        const err = error as Error & { response?: any };
        console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        console.error('Error stack:', err.stack);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        setError(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center font-bold mb-8">All Transactions</h1>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
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

      <div className="mt-6">
        <button 
          onClick={() => router.push('/transactions/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Transaction
        </button>
      </div>
    </div>
  );
}