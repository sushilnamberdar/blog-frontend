import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const CommentForm = ({ postId, onCommentPosted, parentCommentId, onCancelReply }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axiosInstance, user } = useAuth();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (parentCommentId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [parentCommentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      setError("You must be logged in to post a comment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = parentCommentId
        ? `/comments/${parentCommentId}/reply`
        : `/comments/post/${postId}`;

      const res = await axiosInstance.post(url, { content });
      const newComment = {
        ...res.data.comment,
        user: { _id: user._id, name: user.name, avatar: user.avatar },
        ...(parentCommentId && { parentComment: parentCommentId }),
      };

      onCommentPosted(newComment);
      setContent("");
      if (onCancelReply) onCancelReply();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-6 transition-all duration-200 ${
        parentCommentId
          ? "ml-10 border-l-2 border-slate-300 dark:border-slate-700 pl-4"
          : ""
      }`}
    >
      <div
        className={`p-4 rounded-lg border shadow-sm transition-colors duration-200 
          bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
          focus-within:border-slate-400 dark:focus-within:border-slate-500`}
      >
        <textarea
          ref={textareaRef}
          id="comment"
          name="comment"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") handleSubmit(e);
          }}
          placeholder={
            parentCommentId
              ? "Reply to this comment..."
              : "What are your thoughts?"
          }
          className="w-full px-3 py-2 text-sm rounded-md bg-transparent resize-none
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            border-none focus:ring-0"
        />

        {error && (
          <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error}</p>
        )}

        <div className="mt-3 flex justify-end space-x-2">
          {parentCommentId && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCancelReply}
              className="text-xs"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            disabled={!content.trim()}
            className="text-xs px-4"
          >
            {parentCommentId ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
