import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 px-6 py-4 rounded-md text-white text-lg font-semibold z-[9999]";
  const variants = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseClasses} ${variants[type]}`}>
      {message}
    </div>
  );
};

export default Notification;
