import React, { useState, useEffect } from 'react';
import Button from './Button';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full dark:bg-gray-800">
        <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onCancel}>No</Button>
          <Button variant="danger" onClick={onConfirm} disabled={countdown > 0}>
            {countdown > 0 ? `Yes (${countdown}s)` : 'Yes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
