import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyCardSkeleton from '../components/properties/PropertyCardSkeleton';
import { getProperties } from '../services/propertyService';
import type { Property, GetPropertiesParams, LocationType } from '@avalon/shared-types';
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: GetPropertiesParams = {};
        const type = searchParams.get('type') || undefined;
        const category = searchParams.get('category') || undefined;
        const location_type = searchParams.get('location_type') || undefined;
        const min_price = searchParams.get('min_price') || undefined;
        const max_price = searchParams.get('max_price') || undefined;

        if (type) filters.type = type as any;
        if (category) filters.category = category as any;
        if (location_type) filters.location_type = location_type as any;
        if (min_price) filters.min_price = min_price;
        if (max_price) filters.max_price = max_price;

        const response = await getProperties(filters, currentPage);
        setProperties(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(var(--color-dark-bg))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                  Тип имот
                </label>
                <select
                  id="type"
                  value={searchParams.get('type') || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Всички типове</option>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                  Категория
                </label>
                <select
                  id="category"
                  value={searchParams.get('category') || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Всички категории</option>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                  Локация
                </label>
                <select
                  id="location_type"
                  value={searchParams.get('location_type') || ''}
                  onChange={(e) => handleFilterChange('location_type', e.target.value || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Всички локации</option>
                  {Object.entries(locationTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                  Минимална цена
                </label>
                <input
                  type="number"
                  id="min_price"
                  value={searchParams.get('min_price') || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                  Максимална цена
                </label>
                <input
                  type="number"
                  id="max_price"
                  value={searchParams.get('max_price') || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : properties.length ? (
            <div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <TransitionGroup component={null}>
                  {properties.map((property) => (
                    <CSSTransition key={property.id} timeout={500} classNames="fade">
                      <PropertyCard {...property} />
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>

              <div className="mt-8">
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
                    <p className="text-sm text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
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
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-[rgb(var(--color-dark-border))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Следваща</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Няма намерени имоти</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
