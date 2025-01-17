import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { PaginationProps } from '../../types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  let displayedPages = pages;

  // If there are more than 7 pages, show ellipsis
  if (totalPages > 7) {
    if (currentPage <= 4) {
      // Show first 5 pages, ellipsis, and last page
      displayedPages = [...pages.slice(0, 5), -1, totalPages];
    } else if (currentPage >= totalPages - 3) {
      // Show first page, ellipsis, and last 5 pages
      displayedPages = [1, -1, ...pages.slice(totalPages - 5)];
    } else {
      // Show first page, ellipsis, current page and neighbors, ellipsis, and last page
      displayedPages = [
        1,
        -1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        -2,
        totalPages
      ];
    }
  }

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex relative items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="hidden sm:flex">
            {displayedPages.map((page, index) => {
              if (page === -1 || page === -2) {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex relative items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-300 dark:ring-gray-600 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={classNames(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0',
                    currentPage === page
                      ? 'z-10 bg-primary-600 dark:bg-primary-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-offset-0'
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex relative items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}; 
