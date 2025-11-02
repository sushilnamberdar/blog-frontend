import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { IconLoader } from '../components/ui/icons';

const ProfilePage = () => {
  const { user, axiosInstance, fetchUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarSuccess, setAvatarSuccess] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState(null);
  const [roleSuccess, setRoleSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setEmail(user.email);
      setRole(user.role);
      setAvatarPreview(user.avatar);
      setLoading(false);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);
    setAvatarError(null);
    setAvatarSuccess(null);

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      await axiosInstance.put('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchUser();
      setAvatarSuccess('Profile picture updated successfully!');
    } catch (err) {
      setAvatarError(err.response?.data?.message || err.message || 'An error occurred during upload');
    }
    setAvatarLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosInstance.put('/users/profile', { name, email, bio });
      fetchUser();
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setLoading(false);
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    setRoleLoading(true);
    setRoleError(null);
    setRoleSuccess(null);

    try {
      await axiosInstance.put('/users/profile/role', { role });
      fetchUser();
      setRoleSuccess('Role updated successfully!');
    } catch (err) {
      setRoleError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setRoleLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><IconLoader /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Profile</h1>

      <div className="mb-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-100">Profile Picture</h2>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={avatarPreview || `https://i.pravatar.cc/150?u=${user._id}`}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
          />
          {avatarError && <p className="text-red-500 text-sm dark:text-red-400">{avatarError}</p>}
          {avatarSuccess && <p className="text-green-500 text-sm dark:text-green-400">{avatarSuccess}</p>}
          <Button onClick={handleAvatarUpload} isLoading={avatarLoading} disabled={!avatarFile}>
            Upload New Picture
          </Button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="bio"
          label="Bio"
          type="text"
          placeholder="Your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        {/* <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> */}
        {error && <p className="text-red-500 text-sm dark:text-red-400">{error}</p>}
        {success && <p className="text-green-500 text-sm dark:text-green-400">{success}</p>}
        <Button type="submit" isLoading={loading}>Update Profile</Button>
      </form>

      <div className="mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-100">Change Role</h2>
        <form className="space-y-6" onSubmit={handleRoleUpdate}>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="reader">Reader</option>
              <option value="author">Author</option>
            </select>
          </div>
          {roleError && <p className="text-red-500 text-sm dark:text-red-400">{roleError}</p>}
          {roleSuccess && <p className="text-green-500 text-sm dark:text-green-400">{roleSuccess}</p>}
          <Button type="submit" isLoading={roleLoading}>Update Role</Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
