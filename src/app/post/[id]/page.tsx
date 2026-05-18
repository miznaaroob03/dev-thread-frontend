'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only this specific post
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading post...</div>;
  if (!post) return <div className="p-10 text-center text-red-500">Post not found.</div>;

  return (
    <div className="min-h-screen bg-gray-200">
      <main className="max-w-5xl mx-auto flex gap-6 p-5 items-start">
        <div className="flex-1 space-y-4">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-2 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={20} /> Back to Feed
          </button>

          {/* The Post Detail */}
          <PostCard 
            id={post.id}
            user={post.authorId || post.author || "anonymous"}
            title={post.title}
            content={post.content}
            votes={post.votes}
            createdAt={post.createdAt}
            _count={post._count}
            comments={post.comments || []}
          />
        </div>
        <Sidebar />
      </main>
    </div>
  );
}