'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';

export default function UserProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return <div className="text-center p-20 text-gray-500">Loading user profile...</div>;
  }

  if (!profileData) {
    return (
      <div className="text-center p-20 text-red-500 font-bold">
        User profile u/{username} does not exist.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <main className="max-w-5xl mx-auto flex gap-6 p-5 pt-20 items-start">
        <div className="flex-1 space-y-4">
          
          {/* USER INFORMATION HEADER BANNER */}
          <div className="bg-white p-6 rounded border border-gray-300 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl text-white font-bold uppercase">
              {profileData.username ? profileData.username[0] : 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                u/{profileData.username}
              </h1>
              <p className="text-gray-500 text-xs mt-1 font-semibold">
                Joined Communities: {profileData.communities?.length || 0} • Total Posts: {profileData.posts?.length || 0}
              </p>
            </div>
          </div>

          {/* USER'S PERSONAL RECENT POSTS FEED */}
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider pl-1 mt-6">
            Recent Posts by u/{profileData.username}
          </h2>

          {profileData.posts && profileData.posts.length > 0 ? (
            profileData.posts.map((post: any) => (
              <PostCard 
                key={post.id} 
                id={post.id}
                user={profileData.username} 
                authorEmail={profileData.email} 
                title={post.title}
                content={post.content} 
                votes={post.votes}
                createdAt={post.createdAt}
                _count={post._count} 
                comments={post.comments || []}
                communityName={post.community?.name || "general"}
                refreshFeed={fetchProfile}
              />
            ))
          ) : (
            <div className="bg-white p-12 rounded border border-gray-300 text-center text-gray-500">
              This user hasn't posted anything yet.
            </div>
          )}
        </div>
        
        {/* RIGHT SIDEBAR BANNER SHOWING JOINED COMMUNITIES SUB-LIST */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Joined Subreddits
            </h3>
            {profileData.communities && profileData.communities.length > 0 ? (
              <div className="space-y-2">
                {profileData.communities.map((comm: any) => (
                  <div key={comm.id} className="text-sm font-semibold text-gray-700 bg-gray-50 p-2 rounded border hover:bg-gray-100 transition-colors">
                    r/{comm.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Hasn't joined any subreddits yet.</p>
            )}
          </div>
          <Sidebar />
        </div>

      </main>
    </div>
  );
}