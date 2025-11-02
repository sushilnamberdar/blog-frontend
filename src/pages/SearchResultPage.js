import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DUMMY_POSTS } from '../utils/dummyData';
import PostCard from '../components/blog/PostCard';

const SearchResultPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const [searchParams] = useSearchParams();
  
  const query = searchParams.get('q');

  useEffect(() => {
    if (!query) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts/search?q=${encodeURIComponent(query)}`);
        setPosts(res.data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message + '. Filtering dummy data.');
        console.warn('Search fetch failed, filtering dummy data:', err);
        const filteredPosts = DUMMY_POSTS.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
        );
        setPosts(filteredPosts);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [query, axiosInstance]); // Re-run effect if query changes

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Search Results for: "{query}"
        </h1>
        <Link
          to="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
        >
          &larr; Back to Home
        </Link>
      </div>

      {loading && <p className="dark:text-gray-300">Searching...</p>}
      {error && <p className="text-yellow-700 bg-yellow-100 p-3 rounded-md mb-4 text-sm dark:bg-yellow-900 dark:text-yellow-200">{error}</p>}

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && posts.length === 0 && (
          <p className="text-gray-600 col-span-full dark:text-gray-400">No posts found matching your search.</p>
        )}
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultPage;
