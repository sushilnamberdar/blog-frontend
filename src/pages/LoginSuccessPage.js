import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // Redirect to home page after 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600 dark:text-green-400">
          Login Successful!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          You will be redirected to the home page shortly.
        </p>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
