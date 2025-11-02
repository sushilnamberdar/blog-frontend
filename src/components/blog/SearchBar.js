import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch } from '../ui/icons';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Don't search for empty string
    
    // Navigate to the search results page
    navigate(`/search?q=${query}`);
    setQuery(''); // Optional: clear search bar after search
  };

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
      <label htmlFor="search" className="sr-only">Search posts</label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch className="text-gray-400" />
        </div>
        <input
          type="search"
          name="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-4 pl-10 text-sm border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          placeholder="Search for posts..."
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-6 py-2 m-1.5 text-sm font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:ring-offset-gray-800"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
