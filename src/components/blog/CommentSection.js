import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const COMMENTS_PER_PAGE = 10;

const CommentSection = ({ postId }) => {
  const { user, axiosInstance } = useAuth();
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  const observer = useRef();

  const lastCommentRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchComments = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/comments/post/${postId}?page=${pageNumber}&limit=${COMMENTS_PER_PAGE}`
      );

      const fetched = res.data.comments || [];
      const total = res.data.pagination?.totalAllComments || 0;
      const totalPages = res.data.pagination?.totalPages || 1;

      setComments((prev) =>
        pageNumber === 1 ? fetched : [...prev, ...fetched]
      );
      setTotalComments(total);
      setHasMore(pageNumber < totalPages);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [page, postId]);

  const onCommentPosted = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
    setTotalComments((prev) => prev + 1);
    setReplyToCommentId(null);
  };

  const handleLikeToggle = async (commentId) => {
    if (!user) {
      alert('You must be logged in to like comments.');
      return;
    }
    try {
      await axiosInstance.put(`/comments/${commentId}/like`);
      const updateLikes = (arr) =>
        arr.map((c) => {
          if (c._id === commentId) {
            const liked = c.likes.includes(user._id);
            return {
              ...c,
              likes: liked
                ? c.likes.filter((id) => id !== user._id)
                : [...c.likes, user._id],
            };
          } else if (c.replies?.length) {
            return { ...c, replies: updateLikes(c.replies) };
          }
          return c;
        });
      setComments((prev) => updateLikes(prev));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      const removeComment = (arr) =>
        arr
          .filter((c) => c._id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : [],
          }));
      setComments((prev) => removeComment(prev));
      setTotalComments((prev) => prev - 1);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Discussion ({totalComments})
      </h2>

      {user ? (
        <CommentForm
          postId={postId}
          onCommentPosted={onCommentPosted}
          parentCommentId={replyToCommentId}
          onCancelReply={() => setReplyToCommentId(null)}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Log in to join the discussion.
        </p>
      )}

      <CommentList
        comments={comments}
        onReplyClick={setReplyToCommentId}
        onLikeToggle={handleLikeToggle}
        onDeleteComment={handleDeleteComment}
        currentUser={user}
        lastCommentRef={lastCommentRef}
      />

      {loading && (
        <p className="text-gray-500 text-center mt-4">Loading comments...</p>
      )}
      {!hasMore && !loading && comments.length > 0 && (
        <p className="text-gray-400 text-center mt-4">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
};

export default CommentSection;
