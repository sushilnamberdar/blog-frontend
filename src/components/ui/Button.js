import React from 'react';
import { IconLoader } from './icons';

const Button = ({ children, onClick, type = 'button', isLoading = false, disabled = false, variant = 'primary', size = 'md', className = '' }) => {
  const baseClasses = "flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
  
  const variants = {
    primary: "border border-transparent text-white bg-slate-800 hover:bg-slate-900 focus:ring-slate-500",
    secondary: "border border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    danger: "border border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "border border-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-md shadow-sm",
    lg: "px-6 py-3 text-base rounded-md shadow-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`w-full ${baseClasses} ${sizes[size]} ${variants[variant]} ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? <IconLoader /> : children}
    </button>
  );
};

export default Button;
