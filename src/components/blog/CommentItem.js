import React, { useState } from "react";
import {
  IconChevronRight,
  IconChevronDown,
  IconUser,
  IconHeart,
  IconTrash2,
  IconReply
} from "../ui/icons";

import Button from "../ui/Button";
import CommentList from "./CommentList";

const CommentItem = ({ comment, onReplyClick, onLikeToggle, onDeleteComment, currentUser, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isLiked = currentUser && comment.likes?.includes(currentUser._id);
  const isOwner = currentUser && comment.user?._id === currentUser._id;


  const [replyingTo, setReplyingTo] = useState(null);

  return (
    <div
      className={`group relative flex items-start space-x-3 py-4 rounded-lg transition-all duration-150
    ${depth > 0 ? "pl-8 before:absolute before:left-3 before:top-0 before:w-[18px] before:h-[calc(100%+12px)] before:border-l-2 before:border-b-2 before:border-gray-300 dark:before:border-gray-700 before:rounded-bl-2xl" : "border-b border-gray-200 dark:border-gray-700"}
    hover:bg-gray-50 dark:hover:bg-gray-800/40`}
    >

      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {comment.user?.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <IconUser className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Comment body */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.user?.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              • {comment.createdAtFormatted || new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          {comment.replies?.length > 0 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center"
            >
              {collapsed ? (
                <>
                  <IconChevronRight className="w-4 h-4 mr-1" /> Expand
                </>
              ) : (
                <>
                  <IconChevronDown className="w-4 h-4 mr-1" /> Collapse
                </>
              )}
            </button>
          )}
        </div>

        {comment.isHidden ? (
          <p className="mt-1 italic text-gray-500 dark:text-gray-400">
            This comment has been hidden due to multiple reports.
          </p>
        ) : (
          <p className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Actions */}
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLikeToggle(comment._id)}
            className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            disabled={!currentUser}
          >
            <IconHeart className="w-4 h-4" />
            {comment.likes?.length > 0 && <span>{comment.likes.length}</span>}
          </Button>

          {currentUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReplyClick(comment._id)}
              className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <IconReply className="w-4 h-4" />
              <span>Reply</span>
            </Button>
          )}

          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteComment(comment._id)}
              className="flex items-center space-x-1 hover:text-red-600 dark:hover:text-red-400"
            >
              <IconTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>

        {!collapsed && comment.replies?.length > 0 && (
          <div className="mt-3">
            <CommentList
              comments={comment.replies}
              onReplyClick={onReplyClick}
              onLikeToggle={onLikeToggle}
              onDeleteComment={onDeleteComment}
              currentUser={currentUser}
              replyingTo={replyingTo}
              depth={depth + 1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
