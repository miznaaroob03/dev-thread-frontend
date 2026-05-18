"use client"
import { useState } from 'react';
import { useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreatePostModal({ isOpen, onClose, communityName }: any) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) return alert("You must be logged in to post!");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          author: session.user.email, // Link to the user in your Prisma Studio
          communityName: communityName // Link to r/coding-part
        }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to create post");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Create a Post in r/{communityName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full border p-2 rounded" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <textarea 
            className="w-full border p-2 rounded h-32" 
            placeholder="Text (optional)" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}