import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, ThumbsUp, MessageSquare, User, ArrowLeft } from 'lucide-react';

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
    bio: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface UserData {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
}

const UserPosts = () => {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserAndPosts();
  }, [userId]);

  const fetchUserAndPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userResponse = await axios.get(`https://penster-frontend.vercel.app/api/users/${userId}`);
      setUser(userResponse.data);
      
      // Fetch user's posts
      const postsResponse = await axios.get(`https://penster-frontend.vercel.app/api/posts/user/${userId}`);
      setPosts(postsResponse.data);
      
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || 'User not found'}</p>
        <Link to="/" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
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
        
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || 'https://via.placeholder.com/100'}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}'s Posts
            </h1>
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {user.name} hasn't published any posts yet.
          </p>
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
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;