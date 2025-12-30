'use client';

import { useRouter } from 'next/navigation';
import ComplaintForm from '@/app/components/ComplaintForm';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-indigo-600">Complaint Management</h1>
            </div>

            {/* Admin Login Button */}
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors duration-200"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h2>
          <p className="text-gray-600">Please fill out the form below to submit your complaint. We'll review it shortly.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
          <ComplaintForm />
        </div>
      </main>
    </div>
  );
}
