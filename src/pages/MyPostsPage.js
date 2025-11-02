import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import PostCard from '../components/blog/PostCard';
import { IconLoader } from '../components/ui/icons';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const { showNotification } = useNotification();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/posts/my-posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [axiosInstance]);

  const handleDelete = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/posts/${postIdToDelete}`);
      showNotification('Post moved to trash');
      fetchPosts(); // Refetch posts after deleting
    } catch (err) {
      showNotification(err.response?.data?.message || err.message || 'An error occurred', 'error');
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setShowConfirmModal(false);
  };

  const handleUpdate = (post) => {
    navigate('/create', { state: { post } });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><IconLoader /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">My Posts</h1>
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to move this post to the trash?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">You haven't created any posts yet.</p>
          <Button className="mt-4 w-auto" onClick={() => navigate('/create')}>Create a new post</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post._id} className="relative">
              <PostCard post={post} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleUpdate(post)}>Update</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(post._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
