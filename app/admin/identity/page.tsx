// app/components/admin/AdminIdentity.tsx
'use client';

import { useRouter } from 'next/navigation';

export function AdminIdentity() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
        <p className="mt-1 text-sm text-gray-600">Please choose an option to continue</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/login')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Admin Login
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/admin/signup')}
          className="w-full border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
        >
            Admin Signup
        </button>
      </div>
    </div>
  );
}