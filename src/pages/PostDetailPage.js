import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DUMMY_POSTS } from '../utils/dummyData';
import { IconUser, IconCalendar, IconTag, IconArrowLeft } from '../components/ui/icons';
import NotFoundPage from './NotFoundPage';
import CommentSection from '../components/blog/CommentSection';
import { useEffect, useState } from 'react';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';

const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, axiosInstance } = useAuth();
  const { id } = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data.post);
        setLikeCount(res.data.post.likes?.length || 0);
        if (user) {
          setIsLiked(res.data.post.likes.includes(user._id));
          setIsSaved(user.savedPosts.includes(res.data.post._id));
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message + '.');
        const dummyPost = DUMMY_POSTS.find(p => p._id === id);
        if (dummyPost) {
          setPost(dummyPost);
          setLikeCount(dummyPost.likes?.length || 0);
          setError(null);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, axiosInstance, user]);

  const handleLike = async () => {
    if (!user) return;

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

  const handleSave = async () => {
    if (!user) return;

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

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        if (block.value.includes('<iframe')) {
          return <div key={index} dangerouslySetInnerHTML={{ __html: block.value }} />;
        }
        try {
          const url = new URL(block.value);
          return <a key={index} href={url.href} className="text-blue-500 hover:underline">{url.href}</a>;
        } catch (_) {
          return <p key={index} className="mb-4">{block.value}</p>;
        }
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-4 flex items-center">{ <img src={post.author?.avatar } alt={post.author?.name} className="w-6 h-6 rounded-full mr-2 inline-block" /> ||<IconUser />  } <span className="ml-1.5">{post.author?.name || 'Unknown'}</span></span>
          <span className="flex items-center"><IconCalendar /> <span className="ml-1.5">{new Date(post.createdAt).toLocaleDateString()}</span></span> 
        </div>
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

      <article className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
        {post.contentBlocks && post.contentBlocks.map((block, index) => renderContentBlock(block, index))}
      </article>

      <CommentSection postId={post._id} />

    </div>
  );
};

export default PostDetailPage;
