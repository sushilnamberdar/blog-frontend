import React from 'react';
import { IconUser, IconHeart, IconTrash2, IconReply } from '../ui/icons';
import Button from '../ui/Button';
import CommentList from './CommentList'; // Import CommentList for nested replies

const CommentItem = ({ comment, onReplyClick, onLikeToggle, onDeleteComment, currentUser }) => {
  const isLiked = currentUser && comment.likes && comment.likes.includes(currentUser._id);
  const isOwner = currentUser && comment.user && comment.user._id === currentUser._id;

  return (
    <li className="flex space-x-4 py-4 first:pt-0 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center dark:bg-gray-700">
        {comment.user?.avatar ? (
          <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <IconUser className="text-gray-500 dark:text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800 dark:text-gray-100">{comment.user?.name || 'Anonymous'}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        {comment.isHidden ? (
          <p className="text-gray-500 mt-1 italic dark:text-gray-400">This comment has been hidden due to multiple reports.</p>
        ) : (
          <p className="text-gray-700 mt-1 dark:text-gray-300">{comment.content}</p>
        )}

        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLikeToggle(comment._id)}
            className={`flex items-center ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            disabled={!currentUser}
          >
            <div className='flex items-center space-x-5'>
            <IconHeart className="mr-1" /> {comment.likes.length > 0 && comment.likes.length}
            </div>
          </Button>
          
          {currentUser && (
            <Button variant="ghost" size="sm" onClick={() => onReplyClick(comment._id)} className="flex items-center hover:text-slate-700 dark:hover:text-slate-300">
              <IconReply className="mr-1" /> Reply
            </Button>
          )}
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment._id)} className="flex items-center hover:text-red-600 dark:hover:text-red-400">
              <IconTrash2 className="mr-1" /> Delete
            </Button>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-10 mt-4">
            <CommentList 
              comments={comment.replies} 
              onReplyClick={onReplyClick}
              onLikeToggle={onLikeToggle}
              onDeleteComment={onDeleteComment}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </li>
  );
};

export default CommentItem;
