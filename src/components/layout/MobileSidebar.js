
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth();

  if (!isSidebarOpen) return null;

  const closeMenu = () => setIsSidebarOpen(false);

  // In a real app, these would come from an API
  const categories = ['React', 'JavaScript', 'WebDev', 'CSS & Design', 'Security', 'Backend'];
  const popularTags = ['React', 'JavaScript', 'Tailwind', 'API', 'Security', 'Node.js', 'Demo'];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      onClick={closeMenu}
    >


      <div
        className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-4 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Menu</h2>
          <button onClick={closeMenu} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-4">
          {/* navigation Links */}
          <div className="mb-6 flex flex-col space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
              onClick={closeMenu}
            >
              About
            </Link>
            {user && (
              <Link
                to="/create"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
                onClick={closeMenu}
              >
                New Post
              </Link>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-gray-100">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category}>
                  <Link
                    to={`/search?q=${category}`}
                    onClick={closeMenu}
                    className="text-gray-600 hover:text-slate-800 dark:text-gray-400 dark:hover:text-slate-100"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-gray-100">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Link
                  key={tag}
                  to={`/search?q=${tag}`}
                  onClick={closeMenu}
                  className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
