import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import PostCard from '../components/blog/PostCard';
import { IconLoader } from '../components/ui/icons';
import Button from '../components/ui/Button';

const TrashPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const { showNotification } = useNotification();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/posts/trash/mine');
      setPosts(res.data.trashedPosts || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [axiosInstance]);

  const handleRestore = async (postId) => {
    try {
      await axiosInstance.put(`/posts/${postId}/restore`);
      showNotification('Post restored successfully');
      fetchPosts(); // Refetch posts after restoring
    } catch (err) {
      showNotification(err.response?.data?.message || err.message || 'An error occurred', 'error');
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><IconLoader /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Trash</h1>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">Your trash is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post._id} className="relative">
              <PostCard post={post} />
              <div className="absolute top-2 right-2">
                <Button size="sm" variant="secondary" onClick={() => handleRestore(post._id)}>Restore</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
