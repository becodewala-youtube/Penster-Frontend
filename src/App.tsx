import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import EditPost from './pages/EditPost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthCallback from './pages/OAuthCallback';
import UserPosts from './pages/UserPosts';
import BookmarkedPosts from './pages/BookmarkedPosts';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/user/:userId/posts" element={<UserPosts />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/edit-post/:id" element={<EditPost />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/bookmarks" element={<BookmarkedPosts />} />
                </Route>
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;