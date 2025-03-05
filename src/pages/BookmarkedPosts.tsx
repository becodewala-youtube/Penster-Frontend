import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ThumbsUp, MessageSquare, Bookmark, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
}

const BookmarkedPosts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookmarkedPosts();
  }, [user, navigate]);

  const fetchBookmarkedPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://penster-backend.vercel.app/api/posts/bookmarks/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch bookmarked posts');
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://penster-backend.vercel.app/api/posts/${postId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Remove the post from the list
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Bookmarked Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Posts you've saved to read later
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Bookmark className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No bookmarked posts
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't bookmarked any posts yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Posts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src={post.author.avatar || 'https://via.placeholder.com/40'}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Link to={`/posts/${post._id}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content.replace(/<[^>]*>?/gm, '')}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes.length}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments.length}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(post._id)}
                    className="flex items-center text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="Remove bookmark"
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedPosts;