import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, MessageSquare, Share2, Bookmark, Clock, Edit, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

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
  comments: Comment[];
  bookmarks: string[];
  createdAt: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchPost();
    // Set share URL
    setShareUrl(window.location.href);
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(response.data);
      
      // Check if post is bookmarked by current user
      if (user && response.data.bookmarks.includes(user._id)) {
        setIsBookmarked(true);
      }
      
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch post');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchPost();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${id}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsBookmarked(!isBookmarked);
      fetchPost();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to bookmark post');
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const shareOnSocialMedia = (platform: string) => {
    let shareLink = '';
    const postTitle = post?.title || 'Check out this post';
    
    switch(platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComment('');
      fetchPost();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/posts/${id}/comment/${commentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchPost();
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const handleEditPost = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDeletePost = async () => {
    if (!user || !post) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/posts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        navigate('/profile');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || 'Post not found'}</p>
      </div>
    );
  }

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar || 'https://via.placeholder.com/40'}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isAuthor && (
                <>
                  <button
                    onClick={handleEditPost}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600"
                    title="Edit post"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                    title="Delete post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={handleLike}
                className={`p-2 rounded-full ${
                  user && post.likes.includes(user._id)
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title="Like post"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  title="Share post"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 p-2">
                    <div className="p-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Share this post</p>
                      <div className="flex space-x-2 mb-3">
                        <button 
                          onClick={() => shareOnSocialMedia('twitter')}
                          className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
                          title="Share on Twitter"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => shareOnSocialMedia('facebook')}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                          title="Share on Facebook"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => shareOnSocialMedia('linkedin')}
                          className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                          title="Share on LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="text" 
                          value={shareUrl} 
                          readOnly
                          className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button 
                          onClick={copyToClipboard}
                          className="bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm hover:bg-blue-700"
                        >
                          Copy
                        </button>
                      </div>
                      {copySuccess && (
                        <p className="text-green-600 text-xs mt-1">{copySuccess}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full ${
                  isBookmarked
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark post"}
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Comments ({post.comments.length})
            </h3>

            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
                required
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Comment
              </button>
            </form>

            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={comment.user.avatar || 'https://via.placeholder.com/32'}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comment.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {user && comment.user._id === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;