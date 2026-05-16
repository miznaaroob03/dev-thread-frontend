"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Hash, Plus } from 'lucide-react';
import { useSession } from "next-auth/react";
import CreateCommunityModal from './CreateCommunityModal';

export default function Sidebar() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
  const controller = new AbortController(); // 1. Create controller

  fetch('http://localhost:5000/api/communities', { signal: controller.signal }) // 2. Pass signal
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) setCommunities(data);
      setLoading(false);
    })
    .catch(err => {
      if (err.name !== 'AbortError') { // 3. Ignore abort errors
        console.error("Sidebar fetch error:", err);
        setLoading(false);
      }
    });

  return () => controller.abort(); // 4. Cleanup on unmount
}, []);

  return (
    <div className="w-64 bg-white border border-gray-300 rounded p-4 hidden md:block h-fit sticky top-20">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        Communities
      </h2>
      
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs text-gray-400">Loading communities...</p>
        ) : communities.length > 0 ? (
          communities.map((community: any) => (
            <Link 
              key={community.id} 
              href={`/r/${community.name}`} 
              className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded transition-colors cursor-pointer group"
            >
              <Hash size={16} className="text-gray-400 group-hover:text-orange-600" />
              <span className="font-medium text-gray-800">r/{community.name}</span>
            </Link>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">No communities found</p>
        )}
      </div>
      
      {/* Show the 'Create Community' button only if logged in */}
      {session && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Create Community
        </button>
      )}

      <CreateCommunityModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Optional: Refresh list after closing modal
        }} 
      />
    </div>
  );
}