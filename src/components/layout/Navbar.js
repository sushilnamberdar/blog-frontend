import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800 dark:shadow-md dark:shadow-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                          MyBlog
                        </Link>
                      </div>
                      <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link
                          to="/"
                          className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
                        >
                          Home
                        </Link>
                        <Link
                          to="/about"
                          className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
                        >
                          About
                        </Link>
                        {user && (
                          <Link
                            to="/create"
                            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
                          >
                            New Post
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-red-500 hover:border-red-300 hover:text-red-700 dark:text-red-400 dark:hover:border-red-500 dark:hover:text-red-300"
                          >
                            Admin Panel
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    
                    <div className="flex items-center space-x-2">
                       <div className="-mr-2 flex items-center sm:hidden">
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                        aria-controls="mobile-sidebar"
                        aria-expanded="false"
                      >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                      {/* --- THEME TOGGLE --- */}
                      <ThemeToggle />
          
                                  {user ? (
                                    <div className="relative">
                                      <ProfileDropdown />
                                    </div>
                                  ) : (                                  <div className="space-x-4">
                          <Link
                            to="/login"
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          >
                            Sign in
                          </Link>
                          <Link
                            to="/register"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
                          >
                            Sign up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </nav>
  );
};

export default Navbar;
