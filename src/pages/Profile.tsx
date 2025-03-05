import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PenSquare, Trash2, Eye, Clock, ThumbsUp, MessageSquare, Bookmark, Edit, Upload } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
    if (activeTab === 'posts') {
      fetchUserPosts();
    } else if (activeTab === 'drafts') {
      fetchDrafts();
    } else if (activeTab === 'bookmarks') {
      fetchBookmarks();
    }
  }, [user, activeTab, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
      });
      
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/user/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch posts');
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts/drafts/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrafts(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch drafts');
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts/bookmarks/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch bookmarks');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      fetchUserData();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the posts list
      if (activeTab === 'posts') {
        fetchUserPosts();
      } else if (activeTab === 'drafts') {
        fetchDrafts();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handlePublishDraft = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { isDraft: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDrafts();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to publish draft');
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh bookmarks
      const response = await axios.get('http://localhost:5000/api/posts/bookmarks/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(response.data);
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/posts/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(prev => ({
        ...prev,
        avatar: response.data.url
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload image');
    }
  };

  if (loading && activeTab === 'profile') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 4a1 1 0 11-2 0 1 1 0 012 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-2.121-2.121a1 1 0 00-1.414 0L8 10.243l-1.121-1.121a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0L10 11.414l1.536 1.536z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>

          <div className="flex border-b dark:border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              My Posts
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'drafts'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'bookmarks'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('bookmarks')}
            >
              Bookmarks
            </button>
          </div>

          <div className="mt-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                  <div className="md:mr-8 mb-4 md:mb-0 relative group">
                    <img
                      src={profileData.avatar || 'https://via.placeholder.com/150'}
                      alt={profileData.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <Upload className="w-6 h-6 text-white" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {profileData.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {profileData.email}
                    </p>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profileData.bio || 'No bio provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        id="avatar"
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </>
            )}

            {activeTab === 'posts' && (
              <>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        My Published Posts
                      </h2>
                      <Link
                        to="/create-post"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PenSquare className="w-4 h-4 mr-2" />
                        New Post
                      </Link>
                    </div>

                    {posts.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          You haven't published any posts yet.
                        </p>
                        <Link
                          to="/create-post"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PenSquare className="w-4 h-4 mr-2" />
                          Create Your First Post
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {posts.map((post) => (
                          <div
                            key={post._id}
                            className="flex flex-col md:flex-row bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden"
                          >
                            {post.image && (
                              <div className="md:w-1/4">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <div className={`p-4 flex-1 ${!post.image ? 'md:w-full' : 'md:w-3/4'}`}>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {post.content.replace(/<[^>]*>?/gm, '')}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(post.createdAt).toLocaleDateString()}
                                <span className="mx-2">•</span>
                                <span>{post.likes.length} likes</span>
                                <span className="mx-2">•</span>
                                <span>{post.comments.length} comments</span>
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  to={`/posts/${post._id}`}
                                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Link>
                                <Link
                                  to={`/edit-post/${post._id}`}
                                  className="flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeletePost(post._id)}
                                  className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'drafts' && (
              <>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        My Draft Posts
                      </h2>
                      <Link
                        to="/create-post"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PenSquare className="w-4 h-4 mr-2" />
                        New Draft
                      </Link>
                    </div>

                    {drafts.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">
                          You don't have any drafts.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {drafts.map((draft) => (
                          <div
                            key={draft._id}
                            className="flex flex-col md:flex-row bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden"
                          >
                            {draft.image && (
                              <div className="md:w-1/4">
                                <img
                                  src={draft.image}
                                  alt={draft.title}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <div className={`p-4 flex-1 ${!draft.image ? 'md:w-full' : 'md:w-3/4'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {draft.title || 'Untitled Draft'}
                                </h3>
                                <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full">
                                  Draft
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {draft.content.replace(/<[^>]*>?/gm, '') || 'No content yet'}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <Clock className="w-4 h-4 mr-1" />
                                Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  to={`/edit-post/${draft._id}`}
                                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handlePublishDraft(draft._id)}
                                  className="flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  <PenSquare className="w-4 h-4 mr-1" />
                                  Publish
                                </button>
                                <button
                                  onClick={() => handleDeletePost(draft._id)}
                                  className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'bookmarks' && (
              <>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        My Bookmarked Posts
                      </h2>
                      <Link
                        to="/bookmarks"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        View All
                      </Link>
                    </div>

                    {bookmarks.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          You haven't bookmarked any posts yet.
                        </p>
                        <Link
                          to="/"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Browse Posts
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookmarks.map((bookmark) => (
                          <div
                            key={bookmark._id}
                            className="flex flex-col md:flex-row bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden"
                          >
                            {bookmark.image && (
                              <div className="md:w-1/4">
                                <img
                                  src={bookmark.image}
                                  alt={bookmark.title}
                                  className="w-full h-40 object-cover"
                                />
                              </div>
                            )}
                            <div className={`p-4 flex-1 ${!bookmark.image ? 'md:w-full' : 'md:w-3/4'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {bookmark.title}
                                </h3>
                                <div className="flex items-center">
                                  <img
                                    src={bookmark.author.avatar || 'https://via.placeholder.com/32'}
                                    alt={bookmark.author.name}
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {bookmark.author.name}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray- 300 mb-3 line-clamp-2">
                                {bookmark.content.replace(/<[^>]*>?/gm, '')}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(bookmark.createdAt).toLocaleDateString()}
                                <span className="mx-2">•</span>
                                <span>{bookmark.likes.length} likes</span>
                                <span className="mx-2">•</span>
                                <span>{bookmark.comments.length} comments</span>
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  to={`/posts/${bookmark._id}`}
                                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Link>
                                <button
                                  onClick={() => handleBookmark(bookmark._id)}
                                  className="flex items-center text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                                >
                                  <Bookmark className="w-4 h-4 mr-1" />
                                  Remove Bookmark
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;