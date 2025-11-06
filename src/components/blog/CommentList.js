import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
  comments,
  onReplyClick,
  onLikeToggle,
  onDeleteComment,
  replyingToId,
  onCancelReply,
  onInlineReplyPosted,
  currentUser,
  postId,
  depth = 0,
  lastCommentRef
}) => {
  if (!comments || comments.length === 0) {
    return (
      depth === 0 && (
        <p className="text-gray-500 text-sm dark:text-gray-400">
          Be the first to comment.
        </p>
      )
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment, index) => (
        <li
          key={comment._id}
          ref={index === comments.length - 1 && depth === 0 ? lastCommentRef : null}
          className={depth > 0 ? "relative pl-6" : "relative"}  // ← fixed Tailwind class
        >
          {depth > 0 && (
            <span className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-gray-700 rounded-full"></span>
          )}

          <CommentItem
            comment={comment}
            onReplyClick={onReplyClick}
            onLikeToggle={onLikeToggle}
            onDeleteComment={onDeleteComment}
            currentUser={currentUser}
            depth={depth}
            replyingToId={replyingToId}
            onCancelReply={onCancelReply}
            onInlineReplyPosted={onInlineReplyPosted}
            postId={postId}
          />

          {/* Recursively render replies here (single place) */}
          {!comment.collapsed && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 border-l border-gray-300 dark:border-gray-700 pl-4">
              <CommentList
                comments={comment.replies}
                onReplyClick={onReplyClick}
                onLikeToggle={onLikeToggle}
                onDeleteComment={onDeleteComment}
                currentUser={currentUser}
                replyingToId={replyingToId}
                onCancelReply={onCancelReply}
                onInlineReplyPosted={onInlineReplyPosted}
                postId={postId}
                depth={depth + 1}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
