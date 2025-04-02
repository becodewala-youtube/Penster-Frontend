const SkeletonCard = () => {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg animate-pulse mt-12 border border-gray-300 dark:border-gray-700">
        {/* Profile Image Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-32 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-24 rounded mt-2"></div>
          </div>
        </div>
  
        {/* Followers & Following Skeleton */}
        <div className="flex justify-start space-x-6 mt-6">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-10 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-14 rounded mt-2"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-10 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-14 rounded mt-2"></div>
          </div>
        </div>
  
        {/* Followers List Skeleton */}
        <div className="mt-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24 rounded mb-4"></div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-32 rounded"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SkeletonCard;
  