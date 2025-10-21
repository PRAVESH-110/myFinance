"use client";

import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-gray-90">
      {/* Hero Section */}
      <div className=" py-20 mt-5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to myFinance</h1>
          <p className="text-xl md:text-2xl mb-8">Your Personal Finance Management Solution</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-blue-100 text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-400 hover:text-black cursor-pointer transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose myFinance?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-gray-600">Easily monitor your spending and identify saving opportunities with intuitive visualizations.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Smart Budgeting</h3>
              <p className="text-gray-600">Set and track budgets to achieve your financial goals faster.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your financial data is encrypted and protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/3 text-5xl mb-4 md:mb-0">1️⃣</div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your free account in under a minute.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/3 text-5xl mb-4 md:mb-0">2️⃣</div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Connect Accounts</h3>
                <p className="text-gray-600">Link your bank accounts and credit cards (optional).</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 text-5xl mb-4 md:mb-0">3️⃣</div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Start Managing</h3>
                <p className="text-gray-600">Gain insights and take control of your finances.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form (Conditional) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
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
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Sign In
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Just enter any email to continue
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} myFinance. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300">Terms of Service</a>
            <a href="#" className="hover:text-blue-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
