import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FullPageLoader } from './components/ui/Loaders';
import ScrollToTop from './components/layout/ScrollToTop';
import Navbar from './components/layout/Navbar';
import MobileSidebar from './components/layout/MobileSidebar';
import Footer from './components/layout/Footer';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import SearchResultPage from './pages/SearchResultPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import CreatePostPage from './pages/CreatePostPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import MyPostsPage from './pages/MyPostsPage';
import DraftsPage from './pages/DraftsPage';
import TrashPage from './pages/TrashPage';
import ProfilePage from './pages/ProfilePage';

// Main App Component (The "Router")
export default function App() {
  const { isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900">
      <ScrollToTop />
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      <MobileSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/my-posts" element={<MyPostsPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login/success" element={<LoginSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
