import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Users, Clock, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  followers: FollowerData[];
  following: FollowerData[];
}

interface FollowerData {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [followers, setFollowers] = useState<FollowerData[]>([]);
  const [following, setFollowing] = useState<FollowerData[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [userResponse, followersResponse, followingResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/followers`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/following`, { headers })
      ]);

      setUser(userResponse.data);
      setFollowers(followersResponse.data);
      setFollowing(followingResponse.data);

      // Check if current user is following this user
      if (currentUser) {
        const isCurrentlyFollowing = followersResponse.data.some(
          (follower: FollowerData) => follower._id === currentUser._id
        );
        setIsFollowing(isCurrentlyFollowing);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Failed to fetch user data');
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setIsFollowing(response.data.isFollowing);
      await fetchUserData(); // Refresh user data to update followers/following counts
    } catch (error: any) {
      console.error('Error following/unfollowing user:', error);
      setError(error.response?.data?.message || 'Failed to follow/unfollow user');
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://via.placeholder.com/100'}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {user.bio || 'No bio available'}
                </p>
              </div>
            </div>

            {currentUser && currentUser._id !== userId && (
              <button
                onClick={handleFollow}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {followers.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {following.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
            </div>
          </div>

          {/* Followers/Following Tabs */}
          <div className="border-t dark:border-gray-700">
            <div className="flex border-b dark:border-gray-700">
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === 'followers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('followers')}
              >
                Followers
              </button>
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === 'following'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>

            {/* User Lists */}
            <div className="py-4">
              {activeTab === 'followers' ? (
                <div className="space-y-4">
                  {followers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No followers yet
                      </p>
                    </div>
                  ) : (
                    followers.map((follower) => (
                      <Link
                        key={follower._id}
                        to={`/user/${follower._id}`}
                        className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img
                          src={follower.avatar || 'https://via.placeholder.com/40'}
                          alt={follower.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {follower.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {follower.bio || 'No bio available'}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {following.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Not following anyone yet
                      </p>
                    </div>
                  ) : (
                    following.map((followedUser) => (
                      <Link
                        key={followedUser._id}
                        to={`/user/${followedUser._id}`}
                        className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img
                          src={followedUser.avatar || 'https://via.placeholder.com/40'}
                          alt={followedUser.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {followedUser.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {followedUser.bio || 'No bio available'}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;