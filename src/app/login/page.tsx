'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This calls the NextAuth 'credentials' provider we set up in Step 4
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // Don't refresh the whole page
    });

    setLoading(false);

    if (res?.ok) {
      // Login worked! Send them home
      router.push('/');
      router.refresh(); // Refresh to update the Sidebar/Navbar with user data
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Login to DevThread</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="w-full border p-2 rounded text-black outline-none focus:border-blue-500" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full border p-2 rounded text-black outline-none focus:border-blue-500" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-full font-bold transition-colors`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? {' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}