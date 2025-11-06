import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { IconTag } from '../ui/icons';

const PostCard = ({ post }) => {
  const { user, axiosInstance } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user._id));
    }
    if (user && user.savedPosts) {
      setIsSaved(user.savedPosts.includes(post._id));
    }
  }, [user, post]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return; // Or show a login prompt

    try {
      if (isLiked) {
        await axiosInstance.put(`/posts/${post._id}/like`);
        setLikeCount(prev => prev - 1);
      } else {
        await axiosInstance.put(`/posts/${post._id}/like`);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return; // Or show a login prompt

    try {
      if (isSaved) {
        await axiosInstance.delete(`/users/save/${post._id}`);
      } else {
        await axiosInstance.post(`/users/save/${post._id}`);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col dark:bg-gray-800 dark:shadow-lg dark:shadow-black/20">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.coverImage || `https://placehold.co/600x400/64748B/FFFFFF?text=${post.title.split(' ').slice(0, 2).join('+')}`}
          alt={post.title}
          className="w-full h-48 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          {post.tags?.map(tag => (
            <Link
              key={tag}
              to={`/?tag=${tag}`}
              className="inline-block bg-gray-100 text-slate-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-slate-200 dark:hover:bg-gray-600"
            >
               <IconTag /> {tag}
            </Link>
          ))}
        </div>
        <Link to={`/post/${post._id}`}>
          <h2
            className="text-2xl font-semibold text-gray-800 mb-2 truncate cursor-pointer hover:text-slate-600 dark:text-gray-100 dark:hover:text-slate-300"
          >
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
           <img src={post.author?.avatar || `https://i.pravatar.cc/150?u=${post.author?._id}`} alt={post.author?.name} className="w-6 h-6 rounded-full mr-2 inline-block" /> {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-6 text-sm flex-grow dark:text-gray-300">{post.content && post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...</p>
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/post/${post._id}`}
            className="font-medium text-slate-700 hover:text-slate-900 self-start dark:text-slate-300 dark:hover:text-slate-100"
          >
            Read more &rarr;
          </Link>
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              {isLiked ? <SolidHeartIcon className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6" />}
              <span>{likeCount}</span>
            </button>
            <button onClick={handleSave} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              {isSaved ? <SolidBookmarkIcon className="w-6 h-6 text-blue-500" /> : <BookmarkIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
