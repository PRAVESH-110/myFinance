'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UserLoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      
      const loginUrl = 'http://localhost:5000/api/v1/user/signin';
      console.log('Sending login request to:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'  // Explicitly ask for JSON response
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: 'include'  // Important for cookies/sessions
      });
      
      
      // First, get the response text to check if it's valid JSON
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText.substring(0, 100) + '...');
        throw new Error('Received invalid response from server. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Successful login
      console.log('Login successful, response data:', data);
      
      // Store the token from response if available
      console.log('Login response data:', data);
      
      // Check for token in different possible response formats
      const authToken = data.token || data.access_token || data.authToken;
      
      if (authToken) {
        console.log('Storing auth token');
        localStorage.setItem('token', authToken);
        sessionStorage.setItem('token', authToken);
      } else {
        console.warn('No token found in login response. Available keys:', Object.keys(data));
        // If we have a success message but no token, it might be using cookies/session
        if (data.message && data.message.toLowerCase().includes('success')) {
          console.log('Login successful, but no token returned (might be using cookies)');
        } else {
          throw new Error('Authentication failed: No token received');
        }
      }

      // Close the modal first
      onClose();
      console.log('Login successful, redirecting to /transactions/usertransactions');
      
      // Force a full page reload to ensure all auth state is properly initialized
      // This helps with Next.js client-side routing issues
      window.location.href = '/transactions/usertransactions';
    } 
    
    catch (error:any) {
      console.error('Login failed:', error);
      alert(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to handle the redirect
  const handleRedirect = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Login</h2>
        <p className="mt-1 text-sm text-gray-600">Enter your user credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
