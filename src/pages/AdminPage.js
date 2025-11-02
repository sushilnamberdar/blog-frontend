import React from 'react';

// This is a placeholder page. In a real app, you would fetch admin data here.
const AdminPage = () => (
  <div className="max-w-6xl mx-auto py-8 px-4">
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Admin Panel</h1>
      <p className="text-gray-600 dark:text-gray-400">This is a placeholder for the admin dashboard. From here, an admin could:</p>
      <ul className="list-disc list-inside space-y-2 mt-4 text-gray-600 dark:text-gray-400">
        <li>Review posts submitted by authors.</li>
        <li>See all trashed posts and restore or permanently delete them.</li>
        <li>Manage users (e.g., change roles, delete users).</li>
        <li>View site statistics.</li>
      </ul>
    </div>
  </div>
);

export default AdminPage;
