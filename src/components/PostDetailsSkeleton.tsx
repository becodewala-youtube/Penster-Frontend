import React from "react";

const SkeletonBlogPost = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg animate-pulse border border-gray-300 dark:border-gray-700 mt-12">
      {/* Profile Section Skeleton */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-20 rounded mt-2"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 w-3/4 rounded mt-4"></div>

      {/* Description Skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-full rounded mt-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6 rounded mt-2"></div>

      {/* Step Sections Skeleton */}
      <div className="mt-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-2/3 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded mt-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 w-5/6 rounded mt-2"></div>

        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-2/3 rounded mt-6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded mt-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 w-5/6 rounded mt-2"></div>

        <div className="h-5 bg-gray-200 dark:bg-gray-700 w-2/3 rounded mt-6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded mt-2"></div>
      </div>
    </div>
  );
};

export default SkeletonBlogPost;
