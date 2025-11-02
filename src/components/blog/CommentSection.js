import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DUMMY_COMMENTS } from '../../utils/dummyData';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import Pagination from '../ui/Pagination';

const CommentSection = ({ postId }) => {
  const { user, axiosInstance } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const COMMENTS_PER_PAGE = 5; // Define comments per page

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/comments/post/${postId}?page=${page}&limit=${COMMENTS_PER_PAGE}`);
      const fetchedComments = res.data || [];

      setComments(fetchedComments);
      // Assuming pagination info is not directly in res.data if it's an array of comments
      setCommentCurrentPage(1);
      setCommentTotalPages(1);
    } catch (err) {
      setError('Error loading comments. Loading dummy comments.');
      console.warn('Error fetching comments, loading dummy data:', err);
      setComments(DUMMY_COMMENTS[postId] || []);
      setCommentCurrentPage(1);
      setCommentTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments(commentCurrentPage);
  }, [postId, axiosInstance, commentCurrentPage]);

  const onCommentPosted = (newComment) => {
    // After posting a new comment or reply, refetch comments to ensure pagination is correct
    fetchComments(commentCurrentPage);
    setReplyToCommentId(null); // Clear reply form
  };

  const handlePageChange = (page) => {
    setCommentCurrentPage(page);
  };

  const handleLikeToggle = async (commentId) => {
    if (!user) {
      alert('You must be logged in to like comments.');
      return;
    }
    try {
      await axiosInstance.put(`/comments/${commentId}/like`);
      setComments(prevComments => {
        const updateLikes = (commentsArr) => {
          return commentsArr.map(comment => {
            if (comment._id === commentId) {
              const hasLiked = comment.likes.includes(user._id);
              return {
                ...comment,
                likes: hasLiked
                  ? comment.likes.filter(id => id !== user._id)
                  : [...comment.likes, user._id],
              };
            } else if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateLikes(comment.replies),
              };
            }
            return comment;
          });
        };
        return updateLikes(prevComments);
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Discussion</h2>
      {user ? (
        <CommentForm
          postId={postId}
          onCommentPosted={onCommentPosted}
          parentCommentId={replyToCommentId}
          onCancelReply={() => setReplyToCommentId(null)}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          You must be logged in to leave a comment.
        </p>
      )}

      {loading && <p className="dark:text-gray-300">Loading comments...</p>}
      {error && <p className="text-yellow-700 bg-yellow-100 p-3 rounded-md my-4 text-sm dark:bg-yellow-900 dark:text-yellow-200">{error}</p>}
      <CommentList
        comments={comments}
        onReplyClick={handleReplyClick}
        onLikeToggle={handleLikeToggle}
        onDeleteComment={handleDeleteComment}
        currentUser={user}
      />
      {!loading && comments.length > 0 && commentTotalPages > 1 && (
        <Pagination
          currentPage={commentCurrentPage}
          totalPages={commentTotalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CommentSection;
