'use client';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-300 sticky top-0 z-50">
      <Link href="/" className="font-bold text-xl text-orange-600 flex items-center gap-2">
        <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center">D</div>
        dev-thread
      </Link>
      
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-700 font-medium text-sm">
              u/{(session.user as any)?.username || "User"}
            </span>
            <button 
              onClick={() => signOut()} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-bold transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            href="/login" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}