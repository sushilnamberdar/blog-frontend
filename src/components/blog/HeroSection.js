import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';

const HeroSection = () => {
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { axiosInstance, user } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/posts?limit=1');
        if (res.data.posts && res.data.posts.length > 0) {
          const post = res.data.posts[0];
          setLatestPost(post);
          setLikeCount(post.likes?.length || 0);
          if (user) {
            setIsLiked(post.likes.includes(user._id));
            setIsSaved(user.savedPosts.includes(post._id));
          }
        }
      } catch (error) {
        console.error('Error fetching latest post:', error);
      }
      setLoading(false);
    };

    fetchLatestPost();
  }, [axiosInstance, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user || !latestPost) return;

    try {
      if (isLiked) {
        await axiosInstance.put(`/posts/${latestPost._id}/like`);
        setLikeCount(prev => prev - 1);
      } else {
        await axiosInstance.put(`/posts/${latestPost._id}/like`);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !latestPost) return;

    try {
      if (isSaved) {
        await axiosInstance.delete(`/users/save/${latestPost._id}`);
      } else {
        await axiosInstance.post(`/users/save/${latestPost._id}`);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 text-gray-800 py-20 px-4 text-center mb-12 rounded-lg dark:bg-gray-800 dark:text-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to MyBlog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading latest post...</p>
      </div>
    );
  }

  if (!latestPost) {
    return (
      <div className="bg-gray-100 text-gray-800 py-20 px-4 text-center mb-12 rounded-lg dark:bg-gray-800 dark:text-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to MyBlog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
        <img src={latestPost.coverImage || `https://placehold.co/1200x400/64748B/FFFFFF?text=${latestPost.title}`} alt={latestPost.title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">{latestPost.title}</h1>
            {latestPost.content && <p className="text-gray-200 text-lg md:text-xl mb-6 max-w-3xl">{latestPost.content.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>}
            <div className="flex items-center space-x-4">
              <Link to={`/post/${latestPost._id}`} className="bg-slate-700 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-slate-800 transition duration-300">
                  Read More
              </Link>
              <div className="flex items-center space-x-4">
                <button onClick={handleLike} className="flex items-center space-x-1 text-white hover:text-red-500">
                  {isLiked ? <SolidHeartIcon className="w-8 h-8 text-red-500" /> : <HeartIcon className="w-8 h-8" />}
                  <span className="text-lg">{likeCount}</span>
                </button>
                <button onClick={handleSave} className="text-white hover:text-blue-500">
                  {isSaved ? <SolidBookmarkIcon className="w-8 h-8 text-blue-500" /> : <BookmarkIcon className="w-8 h-8" />}
                </button>
              </div>
            </div>
        </div>
    </div>
  );
};

export default HeroSection;
