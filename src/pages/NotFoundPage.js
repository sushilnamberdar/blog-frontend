import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = ({ message }) => (
  <div className="max-w-3xl mx-auto py-12 px-4 text-center">
    <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-200">404</h1>
    <p className="text-xl text-gray-600 mt-4 mb-8 dark:text-gray-400">{message || 'The page you are looking for could not be found.'}</p>
    <Link to="/">
      <Button
        variant="primary"
        className="w-auto px-6" // Override w-full
      >
        Go Home
      </Button>
    </Link>
  </div>
);

export default NotFoundPage;
