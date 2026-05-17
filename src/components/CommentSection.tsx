import { useState, useEffect } from 'react';

export default function CommentSection({ postId, currentUserEmail }: any) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments
  const fetchComments = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handlePostComment = async () => {
    if (!newComment || !currentUserEmail) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newComment,
        postId,
        authorEmail: currentUserEmail
      })
    });
    setNewComment('');
    fetchComments(); // Refresh the list
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex gap-2 mb-4">
        <input 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border p-2 rounded text-sm"
        />
        <button 
          onClick={handlePostComment}
          className="bg-orange-600 text-white px-4 py-1 rounded text-sm font-bold"
        >
          Reply
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((c: any) => (
          <div key={c.id} className="text-sm bg-gray-50 p-2 rounded">
            <span className="font-bold text-orange-600">{c.author.email}</span>
            <p className="text-gray-700">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}