"use client"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PostCard({ 
  id, 
  user, 
  authorEmail, 
  title, 
  content, 
  imageUrl,
  createdAt, 
  votes: initialVotes, 
  _count, 
  comments: initialComments = [],
  communityName,
  refreshFeed 
}: any) {
  const { data: session } = useSession();
  const [votes, setVotes] = useState(initialVotes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments);

  const commentCount = _count?.comments ?? comments.length;

  const getAvatarColor = (name: string) => {
    const safeName = typeof name === 'string' ? name : "A";
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    const index = safeName.length % colors.length;
    return colors[index];
  };

  const timeAgo = createdAt 
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) 
    : "just now";

  const handleVote = async (type: 'up' | 'down') => { 
    if (!session?.user?.email) {
      alert("Please log in to vote!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: type, userEmail: session?.user?.email }),
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setVotes(updatedPost.votes); 

        if (refreshFeed) refreshFeed(); 
      }
    } catch (error) {
      console.error("Voting error:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session?.user?.email }) 
      });
      
      if (response.ok) {
        if (refreshFeed) refreshFeed();
        else window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !session?.user?.email) {
      alert("Please log in to comment!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: commentText, 
          postId: id,
          authorEmail: session.user.email 
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]); 
        setCommentText('');
        setShowComments(true);
        if (refreshFeed) {
          refreshFeed(); 
        }
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session?.user?.email })
      });

      if (response.ok) {
        setComments(comments.filter((c: any) => c.id !== commentId));
        if (refreshFeed) refreshFeed();
      }
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded flex flex-col mb-4 text-left shadow-sm">
      <div className="flex">
        {/* Vote Sidebar */}
        <div className="bg-gray-50 p-2 flex flex-col items-center w-12 rounded-l border-r border-gray-100">
          <button onClick={(e) => { e.stopPropagation(); handleVote('up'); }}>
            <ArrowBigUp className="text-gray-500 hover:text-orange-600" size={24} />
          </button>
          <span className="text-xs font-bold my-1">{votes}</span>
          <button onClick={(e) => { e.stopPropagation(); handleVote('down'); }}>
            <ArrowBigDown className="text-gray-500 hover:text-blue-600" size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${getAvatarColor(user)} w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold uppercase`}>
              {typeof user === 'string' ? user[0] : 'U'}
            </div>
            <div className="text-xs text-gray-500">
              <Link 
                href={`/u/${typeof user === 'string' ? user : "anonymous"}`} 
                className="font-bold text-gray-800 hover:underline hover:text-orange-600 transition-colors cursor-pointer"
              >
                u/{typeof user === 'string' ? user : "anonymous"}
              </Link>
              <span> • {timeAgo} inside r/{communityName}</span>
            </div>
          </div>

          <Link href={`/post/${id}`}>
            <h3 className="text-lg font-bold mt-1 text-gray-900 hover:underline cursor-pointer">
              {title}
            </h3>
          </Link>
          
          <p className="text-sm mt-2 text-gray-700 whitespace-pre-wrap">{content}</p>

          {/* --- FIXED: MOVED IMAGE RENDERING HERE TO OUTSIDE THE COMMENTS LOOP --- */}
          {imageUrl && (
            <div className="mt-3 rounded border border-gray-100 overflow-hidden bg-gray-50 max-h-[450px] flex items-center justify-center">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-contain max-h-[450px]"
                onError={(e) => { 
                  (e.target as HTMLElement).style.display = 'none'; 
                }}
              />
            </div>
          )}
          
          {/* Action Row Buttons */}
          <div className="flex items-center gap-4 mt-4 text-gray-500">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
              className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded text-xs font-bold"
            >
              <MessageSquare size={18} /> {commentCount} Comments
            </button>
            
            <div className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded text-xs font-bold cursor-pointer">
              <Share2 size={18} /> Share
            </div>

            {session?.user?.email === authorEmail && (
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 p-1 rounded text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} /> 
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Comments List */}
          {showComments && (
            <div className="mt-4 space-y-2 border-t pt-4">
              {comments.length > 0 ? (
                comments.map((c: any) => (
                  <div key={c.id} className="bg-gray-50 p-2 rounded border border-gray-100 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`${getAvatarColor(c.author?.email || 'A')} w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold uppercase`}>
                          {(c.author?.email || 'A')[0]}
                        </div>
                        <p className="text-[10px] font-bold text-gray-500">
                          u/{c.author?.username || "anonymous"}
                        </p>
                      </div>

                      {session?.user?.email === c.author?.email && (
                        <button 
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete comment"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-700">{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-400 italic">No comments yet.</p>
              )}
            </div>
          )}

          {/* Comment Input Box */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 bg-gray-100 rounded px-3 py-1.5 text-xs outline-none focus:bg-white focus:border focus:border-blue-500 transition-all text-gray-900"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-700"
            >
              Reply
            </button>
          </div>
        </div> 
      </div>
    </div> 
  );
}