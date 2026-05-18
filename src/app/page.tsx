'use client'; 
import Sidebar from '@/components/Sidebar';
import { Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import SortBar from '@/components/SortBar'; // <--- ADDED: Import SortBar component
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

export default function Home() {// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest'); // <--- ADDED: Track sorting state

  const { data: session } = useSession(); 
  const router = useRouter();

 // 1. First, define the fetchPosts function completely
  // 1. Convert fetchPosts to a clean async function block
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // UPDATED: Dynamically inject userEmail and sortBy query parameters together
      const url = session?.user?.email 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts?userEmail=${session.user.email}&sortBy=${sortBy}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/posts?sortBy=${sortBy}`;

      const res = await fetch(url);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. The useEffect safely executes the async function block below it
  useEffect(() => {
    fetchPosts();
  }, [session, sortBy]);

  const handleCreatePost = async () => {
    if (!title || !content) return alert("Please fill in both fields!");
    if (!session) return alert("You must be logged in to post!");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          imageUrl, 
          author: session.user?.email, 
          communityName: 'general' 
        }), 
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setImageUrl(''); 
        fetchPosts(); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black">
      <main className="max-w-5xl mx-auto flex gap-6 p-5 items-start">
        <div className="flex-1 space-y-4">
          
          {/* Create Post Section */}
          <div className="bg-white border border-gray-300 rounded p-4 space-y-3 shadow-sm">
             <input 
                className="w-full bg-gray-100 rounded px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" 
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
             />
             <input
                type="text"
                placeholder="Optional Image URL (e.g., https://images.unsplash.com/photo...)"
                className="w-full bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:bg-white text-gray-900 text-sm"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
             <textarea 
                className="w-full bg-gray-100 rounded px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 h-20 text-gray-900" 
                placeholder={session ? "What's on your mind?" : "Please log in to post"}
                disabled={!session}
                value={content}
                onChange={(e) => setContent(e.target.value)}
             />
             <div className="flex justify-end">
               <button 
                  onClick={handleCreatePost}
                  disabled={!session}
                  className={`${session ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-1 rounded-full font-bold text-sm flex items-center gap-1`}
               >
                  <Plus size={16} /> Post to r/general
               </button>
             </div>
          </div>

          {/* --- ADDED: RENDER SORTBAR DIRECTLY ABOVE THE FEEDS --- */}
          <SortBar currentSort={sortBy} onSortChange={setSortBy} />

          {/* List of Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center p-10 text-gray-500 font-medium">Loading posts...</div>
            ) : posts.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              posts.map((post: any) => (
                <PostCard 
                  key={post.id} 
                  id={post.id}
                  user={post.author?.username || "anonymous"} 
                  authorEmail={post.author?.email} 
                  title={post.title}
                  content={post.content} 
                  imageUrl={post.imageUrl} 
                  votes={post.votes}
                  createdAt={post.createdAt}
                  _count={post._count} 
                  comments={post.comments || []}
                  communityName={post.community?.name || "general"}
                  refreshFeed={fetchPosts} 
                />
              ))
            ) : (
              <div className="text-center p-10 bg-white border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No posts found in the database.</p>
              </div>
            )}
          </div>
        </div>

        <Sidebar />
      </main>
    </div>
  );
}