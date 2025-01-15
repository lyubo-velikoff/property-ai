import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyCardSkeleton from '../components/properties/PropertyCardSkeleton';
import { getProperties } from '../services/propertyService';
import type { Property, PropertyFilters, LocationType } from '@avalon/shared-types';
import { propertyTypeLabels, locationTypeLabels, categoryLabels, locationTypes } from '../constants/property';

declare module 'react-transition-group';

const regions = [
  'Всички райони',
  'Русе център',
  'Здравец',
  'Дружба',
  'Възраждане',
  'Чародейка',
  'Ялта',
  'Родина',
  'Цветница',
  'Централна градска част',
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Get current filters from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentType = searchParams.get('type') || '';
  const currentRegion = searchParams.get('region') || '';
  const currentCategory = searchParams.get('category') as 'RENT' | 'SALE' | undefined;
  const currentMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const currentLocationType = searchParams.get('location_type') || '';

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: PropertyFilters = {
          type: currentType || undefined,
          region: currentRegion || undefined,
          category: currentCategory,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          location_type: currentLocationType,
        };

        const response = await getProperties(filters, currentPage);
        if (response && response.properties) {
          setProperties(response.properties);
          setTotalPages(Math.ceil(response.total / response.pageSize));
        } else {
          setProperties([]);
          setTotalPages(1);
          setError('No properties found');
        }
      } catch (err) {
        setError('Failed to load properties');
        setProperties([]);
        setTotalPages(1);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [currentPage, currentType, currentRegion, currentCategory, currentMinPrice, currentMaxPrice, currentLocationType]);

  const handleFilterChange = (filters: Partial<PropertyFilters>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Reset page when filters change
    newParams.set('page', '1');
    
    // Update filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]">
      <div className="py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters */}
          <div className="w-full lg:w-1/5">
            <div className="sticky top-24 bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))] p-4 border-b border-gray-200 dark:border-[rgb(var(--color-dark-border))]">Филтри</h2>
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Тип имот
                  </label>
                  <select
                    id="type"
                    value={currentType}
                    onChange={(e) => handleFilterChange({ type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Всички</option>
                    {Object.entries(propertyTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Категория
                  </label>
                  <select
                    id="category"
                    value={currentCategory || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value as 'RENT' | 'SALE' | undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Всички</option>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Локация
                  </label>
                  <select
                    id="location_type"
                    value={currentLocationType}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({ 
                        location_type: value === '' ? undefined : value as 'CITY' | 'REGION'
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Всички</option>
                    {locationTypes.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Минимална цена
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    value={currentMinPrice || ''}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Максимална цена
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    value={currentMaxPrice || ''}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="w-full lg:w-4/5">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))
              ) : properties?.length ? (
                properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))
              ) : (
                <div className="py-12 text-center col-span-full">
                  <p className="text-lg text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Няма намерени имоти
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-[rgb(var(--color-dark-border))] pt-4">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    Предишна
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                  >
                    Следваща
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                      Страница <span className="font-medium">{currentPage}</span> от{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Предишна</span>
                        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Следваща</span>
                        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
