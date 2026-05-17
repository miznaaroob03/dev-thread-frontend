'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    if (res.ok) {
      alert("Account created! Now you can log in.");
      router.push('/login');
    } else {
      alert("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Create Account</h1>
        <input type="text" placeholder="Username" className="w-full border p-2 mb-4 rounded text-black outline-none focus:border-blue-500" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full border p-2 mb-4 rounded text-black outline-none focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 mb-6 rounded text-black outline-none focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-orange-600 text-white p-2 rounded-full font-bold hover:bg-orange-700 transition-colors">Sign Up</button>
      </form>
    </div>
  );
}