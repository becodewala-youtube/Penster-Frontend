import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, PenSquare, User, LogOut, Search, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface SearchResult {
  _id: string;
  title: string;
  author: {
    name: string;
  };
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Clear search when changing routes
  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts?search=${query}&limit=5`);
        setSearchResults(response.data.posts);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
      
      // If search is cleared, navigate to home without search params
      if (query === '' && location.pathname === '/' && location.search.includes('search=')) {
        navigate('/');
      }
    }
  };

  const handleResultClick = (postId: string) => {
    navigate(`/posts/${postId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleClickOutside = () => {
    // Add a small delay to allow click events to register
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            Penster
          </Link>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm py-2"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={handleClickOutside}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </form>
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                    onClick={() => handleResultClick(result._id)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing before click
                  >
                    <p className="font-medium text-gray-800 dark:text-white">{result.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">By {result.author.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-200" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
            
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                    />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className=" px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={logout}
                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className="hidden sm:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm py-2"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={handleClickOutside}
            />
          </div>
        </form>
        
        {showResults && searchResults.length > 0 && (
          <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result._id}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                onClick={() => handleResultClick(result._id)}
                onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing before click
              >
                <p className="font-medium text-gray-800 dark:text-white">{result.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">By {result.author.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;