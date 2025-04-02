const ProfileSkeleton = () => {
    return (
      <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900 bg-gray-50 rounded-lg shadow-lg animate-pulse mt-12">
        {/* Header */}
        <div className="h-6 w-40 dark:bg-gray-700 bg-gray-200 rounded mb-6"></div>
  
        {/* Navigation Tabs */}
        <div className="flex space-x-6 border-b dark:border-gray-700 border-gray-200 pb-2">
          {["Profile", "My Posts", "Drafts", "Bookmarks", "Connections"].map((tab, index) => (
            <div key={index} className="h-5 w-20 dark:bg-gray-700 bg-gray-200 rounded"></div>
          ))}
        </div>
  
        {/* Profile Section */}
        <div className="flex items-center mt-6 space-x-4">
          <div className="w-16 h-16 dark:bg-gray-700 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 dark:bg-gray-700 bg-gray-200 w-32 rounded mb-2"></div>
            <div className="h-4 dark:bg-gray-700 bg-gray-200 w-48 rounded"></div>
          </div>
        </div>
  
        {/* Bio Section */}
        <div className="mt-4">
          <div className="h-4 dark:bg-gray-700 bg-gray-200 w-20 rounded mb-2"></div>
          <div className="h-4 dark:bg-gray-700 bg-gray-200 w-64 rounded"></div>
        </div>
  
        {/* Edit Profile Button */}
        <div className="mt-6">
          <div className="h-10 w-36 dark:bg-gray-700 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  };
  
  export default ProfileSkeleton;
  