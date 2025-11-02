import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // In a real app, these would come from an API
  const categories = ['React', 'JavaScript', 'WebDev', 'CSS & Design', 'Security', 'Backend'];
  const popularTags = ['React', 'JavaScript', 'Tailwind', 'API', 'Security', 'Node.js', 'Demo'];

  return (
    <aside className="w-full lg:w-1/3 lg:pl-8 mt-12 lg:mt-0 hidden lg:block">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">Categories</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <Link
                to={`/?tag=${category}`}
                className="text-gray-600 hover:text-slate-800 dark:text-gray-400 dark:hover:text-slate-100"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Link
              key={tag}
              to={`/?tag=${tag}`}
              className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
