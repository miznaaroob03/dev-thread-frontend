'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateCommunityModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name) return alert("Name is required");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (res.ok) {
      const data = await res.json();
      onClose();
      router.push(`/r/${data.name}`); // Auto-redirect to the new community!
      window.location.reload(); // Refresh to update sidebar
    } else {
      alert("Error creating community");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg text-gray-800">Create a Community</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input 
              className="w-full border rounded p-2 text-sm text-gray-900 outline-none focus:border-blue-500"
              placeholder="e.g., coding-tips"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full border rounded p-2 text-sm text-gray-900 h-24 outline-none focus:border-blue-500"
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-1.5 border rounded-full font-bold text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700">Create Community</button>
        </div>
      </div>
    </div>
  );
}