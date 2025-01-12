import React from 'react';

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-w-16 aspect-h-9">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="absolute top-2 right-2">
          <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
        
        {/* Type and area skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
        </div>
        
        {/* Price and location skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
} 
