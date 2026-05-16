'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { useSession } from 'next-auth/react';

export default function CommunityPage() {
  const { communityName } = useParams();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // 1. Add this state right next to your title and content states:
const [imageUrl, setImageUrl] = useState('');

  // --- COMMUNITY MEMBERSHIP STATES ---
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  // Input states for the Create Post box
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // --- FUNCTION: RE-USABLE POST REFRESHER (OPTION A) ---
  const fetchCommunityPosts = () => {
    fetch(`http://localhost:5000/api/communities/${communityName}/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // 1. Fetch community metadata (Member Count & Join Status)
    const fetchCommunityMetadata = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/communities/${communityName}`);
        if (res.ok) {
          const data = await res.json();
          setMemberCount(data._count?.members || 0);

          // Check if current user is inside the members array
          if (session?.user?.email && data.members) {
            const joined = data.members.some((m: { email: string }) => m.email === session.user.email);
            setIsMember(joined);
          }
        }
      } catch (err) {
        console.error("Error fetching community metadata:", err);
      }
    };

    if (communityName) {
      setLoading(true);
      fetchCommunityMetadata();
      fetchCommunityPosts();
    }
  }, [communityName, session]);

  // --- INTERACTION HANDLER FOR JOINING/LEAVING ---
  const handleCommunityAction = async () => {
    if (!session?.user?.email) {
      alert("Please sign in to join communities!");
      return;
    }

    const action = isMember ? 'leave' : 'join';
    try {
      const response = await fetch(`http://localhost:5000/api/communities/${communityName}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session.user.email })
      });

      if (response.ok) {
        const data = await response.json();
        setIsMember(!isMember); // Toggle visual mode
        setMemberCount(data.memberCount); // Sync updated member total count
      } else {
        alert("Action failed. Try again.");
      }
    } catch (error) {
      console.error(`Action error:`, error);
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content || !session?.user?.email) {
      alert("You must be logged in to create a post!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          imageUrl, // <--- ADDED: Sends the image link to the backend
          author: session.user.email, 
          communityName: communityName 
        })
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        // Instead of breaking state with a full reload, refresh posts cleanly
        setImageUrl(''); // <--- ADDED: Clears the input field upon success
        fetchCommunityPosts();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Post Error:", err);
      alert("Backend server is not responding.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <main className="max-w-5xl mx-auto flex gap-6 p-5 pt-20 items-start">
        <div className="flex-1 space-y-4">
          
          {/* HEADER WITH INTERACTIVE JOIN BUTTON */}
          <div className="bg-white p-4 rounded border border-gray-300 flex justify-between items-center shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-orange-600 tracking-tight">
                r/{communityName}
              </h1>
              <p className="text-gray-500 text-xs font-semibold mt-0.5">
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </p>
            </div>
            
            <button 
              onClick={handleCommunityAction}
              className={`px-6 py-1.5 rounded-full font-bold transition-colors text-sm shadow-sm ${
                isMember 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isMember ? 'Joined' : 'Join'}
            </button>
          </div>

          {/* CREATE POST BOX */}
          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full bg-gray-50 border border-gray-200 rounded p-2 mb-2 outline-none focus:bg-white text-gray-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* --- PASTE THIS NEW INPUT FIELD HERE --- */}
  <input
    type="text"
    placeholder="Optional Image URL (e.g., https://images.unsplash.com/photo...)"
    className="w-full bg-gray-50 border border-gray-200 rounded p-2 mb-2 outline-none focus:bg-white text-gray-900 text-sm"
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
  />


            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-gray-50 border border-gray-200 rounded p-2 h-24 outline-none focus:bg-white resize-none text-gray-900"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCreatePost}
                className="bg-blue-600 text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                + Post to r/{communityName}
              </button>
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="text-center p-10 text-gray-500">Loading feed...</div>
          ) : posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard 
                key={post.id} 
                id={post.id}
                user={post.author?.username || "anonymous"} 
                authorEmail={post.author?.email} 
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl} // <--- ADD THIS LINE HERE 
                votes={post.votes}
                createdAt={post.createdAt}
                _count={post._count} 
                comments={post.comments || []}
                communityName={post.community?.name || "general"}
                refreshFeed={fetchCommunityPosts} // <-- ADDED: Matches your dynamic homepage hook name
              />
            ))
          ) : (
            <div className="bg-white p-10 rounded border border-gray-300 text-center text-gray-500">
              No posts in this community yet. Be the first to post!
            </div>
          )}
        </div>
        <Sidebar />
      </main>
    </div>
  );
}