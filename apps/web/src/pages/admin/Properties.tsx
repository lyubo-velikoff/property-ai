import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, TrashIcon, PlusIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Pagination, usePagination } from '@avalon/shared-ui';
import { getProperties, deleteProperty } from '../../services/propertyService';
import type { Property, GetPropertiesParams } from '@avalon/shared-types';
import { event } from '../../lib/analytics';
import LoadingSpinner from '../../components/LoadingSpinner';
import { propertyTypeLabels, locationTypeLabels, categoryLabels, currencyLabels } from '../../constants/property';
import { useDebounce } from '../../hooks/useDebounce';

function formatPrice(price: number) {
  return new Intl.NumberFormat('bg-BG', {
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const filters = useMemo<GetPropertiesParams>(() => ({
    search: debouncedSearch || undefined
  }), [debouncedSearch]);

  const {
    data: properties,
    currentPage,
    totalPages,
    isLoading: paginationLoading,
    error: paginationError,
    goToPage
  } = usePagination<Property>({
    pageSize: 10,
    fetchData: async (page, pageSize) => {
      const response = await getProperties(filters, page);
      return {
        data: response.data,
        totalPages: response.meta.totalPages
      };
    }
  });

  // Refetch when search changes
  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch]);

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този имот?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete property:', error);
        alert('Възникна грешка при изтриването на имота');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Имоти</h1>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Добави имот
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търси по заглавие..."
              className="block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {paginationLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : paginationError ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
            <p className="mb-4 text-center text-red-600">
              {paginationError instanceof Error ? paginationError.message : 'Възникна грешка при зареждането на имотите'}
            </p>
            <button
              onClick={() => goToPage(currentPage)}
              className="px-4 py-2 text-white bg-red-600 rounded transition-colors hover:bg-red-700"
            >
              Опитайте отново
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Няма намерени имоти</h3>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm hover:bg-red-700"
            >
              <PlusIcon className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" />
              Добави нов имот
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] shadow-sm sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-[rgb(var(--color-dark-border))]">
                <thead className="bg-gray-50 dark:bg-[rgb(var(--color-dark-bg-secondary))]">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Снимка
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Заглавие
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Тип
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Локация
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Цена
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[rgb(var(--color-dark-border))] bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))]">
                  {properties.map((property: Property) => (
                    <tr key={property.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={property.images?.[0]?.url || '/images/property-placeholder.webp'}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/property-placeholder.webp';
                            }}
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="hover:text-primary-600 dark:hover:text-primary-500"
                        >
                          {property.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                        {propertyTypeLabels[property.type]}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                        {property.region?.name || property.neighborhood?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                        {formatPrice(property.price)} {currencyLabels[property.currency]}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/properties/${property.id}/edit`}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
    </div>
  );
} 
