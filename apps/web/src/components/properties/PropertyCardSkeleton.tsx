import React from 'react';

export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] rounded-lg shadow-lg">
      <div className="relative flex-shrink-0 h-48">
        <div className="absolute inset-0 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] animate-pulse" />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded w-3/4 animate-pulse" />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded w-1/3 animate-pulse" />
            <div className="h-5 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded w-1/4 animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
} 
