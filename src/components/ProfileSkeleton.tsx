

const ProfileSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg animate-pulse mt-12">
      {/* Header */}
      <div className="h-6 w-40 bg-gray-700 rounded mb-6"></div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-700 pb-2">
        {["Profile", "My Posts", "Drafts", "Bookmarks", "Connections"].map((tab, index) => (
          <div key={index} className="h-5 w-20 bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="flex items-center mt-6 space-x-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
        <div>
          <div className="h-5 bg-gray-700 w-32 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 w-48 rounded"></div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-4">
        <div className="h-4 bg-gray-700 w-20 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 w-64 rounded"></div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6">
        <div className="h-10 w-36 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
