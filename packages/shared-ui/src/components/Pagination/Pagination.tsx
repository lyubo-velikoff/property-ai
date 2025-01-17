import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { PaginationProps } from '../../types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  buttonLabels = { previous: 'Предишна', next: 'Следваща' },
  pageInfoText = { page: 'Страница', of: 'от' },
  showPageInfo = true
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

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] border-t border-gray-200 dark:border-[rgb(var(--color-dark-border))] sm:px-6" aria-label="Pagination">
      {showPageInfo && (
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
            {pageInfoText.page} <span className="font-medium">{currentPage}</span> {pageInfoText.of}{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
      )}
      <div className={classNames(
        'flex flex-1 justify-between',
        showPageInfo ? 'sm:justify-end' : 'sm:justify-center'
      )}>
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-[rgb(var(--color-dark-text-secondary))] ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-bg))] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            aria-label={buttonLabels.previous}
          >
            <span className="sr-only">{buttonLabels.previous}</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden sm:flex">
            {displayedPages.map((page, index) => {
              if (page === -1 || page === -2) {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))] ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] focus:outline-offset-0"
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
                      ? 'z-10 bg-[rgb(var(--color-primary-600))] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary-600))]'
                      : 'text-gray-900 dark:text-[rgb(var(--color-dark-text))] ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-bg))] focus:outline-offset-0'
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
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-[rgb(var(--color-dark-text-secondary))] ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-bg))] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            aria-label={buttonLabels.next}
          >
            <span className="sr-only">{buttonLabels.next}</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}; 
