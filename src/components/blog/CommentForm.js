import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const CommentForm = ({ postId, onCommentPosted, parentCommentId, onCancelReply }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axiosInstance, user } = useAuth();

  useEffect(() => {
    if (parentCommentId) {
      // Optionally focus the textarea when replying
      // document.getElementById('comment').focus();
    }
  }, [parentCommentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const url = parentCommentId 
        ? `/comments/${parentCommentId}/reply` 
        : `/comments/post/${postId}`;
      const res = await axiosInstance.post(url, { content });
      
      const newCommentWithUser = {
        ...res.data.comment,
        author: { name: user.name },
        // Ensure replies array exists for parent comments if it's a new reply
        ...(parentCommentId && { parentComment: parentCommentId })
      };
      onCommentPosted(newCommentWithUser); 
      setContent(''); 
      if (onCancelReply) onCancelReply(); // Clear reply state in parent
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {parentCommentId ? 'Reply to comment' : 'Leave a comment'}
      </label>
      <textarea
        id="comment"
        name="comment"
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        placeholder={parentCommentId ? 'Your reply...' : 'What are your thoughts?'}
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{error}</p>}
      <div className="mt-2 flex justify-end space-x-2">
        {parentCommentId && (
          <Button type="button" variant="secondary" onClick={onCancelReply}>
            Cancel Reply
          </Button>
        )}
        <Button type="submit" isLoading={loading} className="w-auto px-6">
          {parentCommentId ? 'Post Reply' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;