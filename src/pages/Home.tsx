import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, ThumbsUp, MessageSquare, Bookmark, PenSquare, Filter, Search } from 'lucide-react';
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
  bookmarks: string[];
  createdAt: string;
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const urlSearchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setDebouncedSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedSearchQuery, category, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (debouncedSearchQuery) {
        params.append('search', debouncedSearchQuery);
      }
      
      if (category) {
        params.append('category', category);
      }
      
      if (sortBy === 'mostCommented') {
        params.append('sortBy', 'comments');
      } else {
        params.append('sortBy', sortBy);
      }
      
      const response = await axios.get(`http://localhost:5000/api/posts?${params.toString()}`);
      const newPosts = response.data.posts;
      
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 10);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch posts');
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (user) {
      navigate('/create-post');
    } else {
      navigate('/login');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    if (e.target.value === '' && location.pathname === '/' && location.search.includes('search=')) {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  const categories = [
    'All',
    'Technology',
    'Travel',
    'Food',
    'Lifestyle',
    'Business',
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'mostCommented', label: 'Most Commented' },
  ];

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory === 'All' ? '' : selectedCategory);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleBookmarkPost = async (postId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const isBookmarked = post.bookmarks?.includes(user._id);
            return {
              ...post,
              bookmarks: isBookmarked 
                ? post.bookmarks.filter(id => id !== user._id)
                : [...(post.bookmarks || []), user._id]
            };
          }
          return post;
        })
      );
    } catch (error: any) {
      console.error('Bookmark error:', error);
    }
  };

  const isPostBookmarked = (post: Post) => {
    return user && post.bookmarks?.includes(user._id);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Latest Blog Posts'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `Discover content related to "${searchQuery}"`
              : 'Explore the latest articles from our community'}
          </p>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="mt-4 md:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PenSquare className="w-5 h-5 mr-2" />
          Create Post
        </button>
      </div>

      <div className="md:hidden mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm py-2"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-md"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="text-center py-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-sm ${
                (cat === 'All' && category === '') || cat === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              } transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-500" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {posts.length === 0 && !loading ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery 
              ? `No results found for "${searchQuery}". Try a different search term.` 
              : 'There are no posts available at the moment.'}
          </p>
          {user && (
            <button
              onClick={() => navigate('/create-post')}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PenSquare className="w-5 h-5 mr-2" />
              Create the first post
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105"
            >
              {post.image && (
                <Link to={`/posts/${post._id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
              )}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => handleUserClick(post.author._id)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={post.author.avatar || 'https://via.placeholder.com/40'}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full border-2 border-blue-100 hover:border-blue-300 transition-colors"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                        {post.author.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                </div>

                <Link to={`/posts/${post._id}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
                    <button 
                      onClick={() => handleBookmarkPost(post._id)}
                      className={`flex items-center ${
                        isPostBookmarked(post)
                          ? 'text-yellow-500 dark:text-yellow-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400'
                      } transition-colors`}
                      title={isPostBookmarked(post) ? "Remove bookmark" : "Bookmark post"}
                    >
                      <Bookmark className={`w-4 h-4 ${isPostBookmarked(post) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8 mb-12">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;