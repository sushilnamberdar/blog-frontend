import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DUMMY_POSTS } from '../utils/dummyData';
import { IconUser, IconCalendar, IconTag, IconArrowLeft } from '../components/ui/icons';
import NotFoundPage from './NotFoundPage';
import CommentSection from '../components/blog/CommentSection';
import { useEffect,useState } from 'react';

const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      // If no ID, show error
      if (!id) {
        setError('Post not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data.post);
      } catch (err) {
        setError(err.response?.data?.message || err.message + '.');
        // Try dummy data as fallback
        const dummyPost = DUMMY_POSTS.find(p => p._id === id);
        if (dummyPost) {
          setPost(dummyPost);
          setError(null); // Clear error, we found it in dummy data
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, axiosInstance]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <p className="dark:text-gray-300">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return <NotFoundPage message={`Post with ID "${id}" not found.`} />;
  }

  // Render content blocks
  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return <p key={index} className="mb-4">{block.value}</p>;
      case 'heading':
        return <h2 key={index} className="text-2xl font-bold my-6">{block.value}</h2>;
      case 'image':
        return <img key={index} src={block.value} alt={`Content image ${index + 1}`} className="my-6 rounded-lg shadow-md" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link
        to="/"
        className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <IconArrowLeft />
        Back to all posts
      </Link>

      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100">{post.title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-4 dark:text-gray-400">
        <span className="mr-4 flex items-center"><IconUser /> <span className="ml-1.5">{post.author?.name || 'Unknown'}</span></span>
        <span className="flex items-center"><IconCalendar /> <span className="ml-1.5">{new Date(post.createdAt).toLocaleDateString()}</span></span>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags?.map(tag => (
          <Link
            key={tag}
            to={`/?tag=${tag}`}
            className="inline-flex items-center bg-gray-100 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-slate-200 dark:hover:bg-gray-600"
          >
            <IconTag /> {tag}
          </Link>
        ))}
      </div>

      {/* Article Content */}
      <article className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
        {post.contentBlocks && post.contentBlocks.map((block, index) => renderContentBlock(block, index))}
      </article>

      {/* --- COMMENT SECTION --- */}
      <CommentSection postId={post._id} />

    </div>
  );
};

export default PostDetailPage;
