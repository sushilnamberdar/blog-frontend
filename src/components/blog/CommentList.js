import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onReplyClick, onLikeToggle, onDeleteComment, currentUser }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 text-sm dark:text-gray-400">Be the first to comment.</p>;
  }
  return (
    <ul className="space-y-6">
      {comments.map(comment => (
        <CommentItem 
          key={comment._id} 
          comment={comment} 
          onReplyClick={onReplyClick}
          onLikeToggle={onLikeToggle}
          onDeleteComment={onDeleteComment}
          currentUser={currentUser}
        />
      ))}
    </ul>
  );
};

export default CommentList;
