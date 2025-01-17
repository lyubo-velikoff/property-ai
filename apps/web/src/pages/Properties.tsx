import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Pagination, usePagination } from '@avalon/shared-ui';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyCardSkeleton from '../components/properties/PropertyCardSkeleton';
import { getProperties } from '../services/propertyService';
import type { 
  Property, 
  GetPropertiesParams,
  PropertyType,
  PropertyCategory,
  LocationType
} from '@avalon/shared-types';
import { propertyTypeLabels, locationTypeLabels, categoryLabels } from '../constants/property';

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

  const filters: GetPropertiesParams = {
    type: (searchParams.get('type') as PropertyType) || undefined,
    category: (searchParams.get('category') as PropertyCategory) || undefined,
    location_type: (searchParams.get('location_type') as LocationType) || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined
  };

  const {
    data: properties,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage
  } = usePagination<Property>({
    pageSize: 9,
    fetchData: async (page, pageSize) => {
      const response = await getProperties(filters, page, pageSize);
      return {
        data: response.data,
        totalPages: response.meta.totalPages
      };
    }
  });

  // Initial data fetch
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    goToPage(page);
  }, [searchParams.toString()]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filters change
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

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
              <p className="text-red-600 dark:text-red-400">{error.message}</p>
            </div>
          ) : properties?.length ? (
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
