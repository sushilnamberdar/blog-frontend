import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/blog/SearchBar';
import PostCard from '../components/blog/PostCard';
import Sidebar from '../components/blog/Sidebar';
import HeroSection from '../components/blog/HeroSection';
import Pagination from '../components/ui/Pagination'; // <
import { useEffect,useState } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // <-- Add this
  const [totalPages, setTotalPages] = useState(1); // <-- Add this
  const { axiosInstance } = useAuth(); // Get API URL from context
  const [searchParams] = useSearchParams();

  const activeTag = searchParams.get('tag');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchPosts = async (page = 1) => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts?page=${page}&limit=10${activeTag ? `&tag=${activeTag}` : ''}`);
        setPosts(res.data.posts || []);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching posts.');
      }
      setLoading(false);
    };
    fetchPosts(currentPage);
  }, [activeTag, axiosInstance, currentPage]); // Re-run effect if activeTag or API_BASE_URL changes

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar */}
      <SearchBar />

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">

          {/* Filter Info */}
          {activeTag && (
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm dark:bg-gray-800">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Posts tagged: "{activeTag}"
              </h1>
              <button
                onClick={() => window.location.search = ''}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
              >
                Clear Filter &times;
              </button>
            </div>
          )}

          {!activeTag && <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Latest Posts</h1>}

          {loading && <p className="dark:text-gray-300">Loading posts...</p>}
          {error && <p className="text-yellow-700 bg-yellow-100 p-3 rounded-md mb-4 text-sm dark:bg-yellow-900 dark:text-yellow-200">{error}</p>}

          {/* Post Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!loading && posts.length === 0 && (
              <p className="text-gray-600 col-span-2 dark:text-gray-400">No posts found {activeTag ? `with the tag "${activeTag}"` : ''}.</p>
            )}
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {!loading && posts.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default HomePage;
