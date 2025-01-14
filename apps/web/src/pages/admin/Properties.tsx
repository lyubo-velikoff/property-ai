import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getProperties, deleteProperty, type Property, type PropertyFilters } from '../../services/propertyService';
import { event } from '../../lib/analytics';
import LoadingSpinner from '../../components/LoadingSpinner';
import { propertyTypeLabels, locationTypeLabels, categoryLabels } from '../../constants/property';

export default function Properties() {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', currentPage],
    queryFn: () => getProperties({} as PropertyFilters, currentPage),
  });

  const properties = data?.properties || [];
  const totalPages = data?.pages || 1;

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="mb-4 text-center text-red-600">
          {error instanceof Error ? error.message : 'Възникна грешка при зареждането на имотите'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-white bg-red-600 rounded transition-colors hover:bg-red-700"
        >
          Опитайте отново
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
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
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Имоти</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Списък с всички имоти в системата
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/properties/new"
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => {
              event({
                action: 'property_create_click',
                category: 'Admin',
                label: 'New Property Button'
              });
            }}
          >
            <PlusIcon className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" />
            Нов имот
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 shadow md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Изображение
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Заглавие
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Тип
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Локация
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Цена
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {property.images && property.images[0] && (
                          <img 
                            src={property.images[0].url} 
                            alt={property.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {property.title}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {propertyTypeLabels[property.type] || property.type}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {locationTypeLabels[property.location_type] || property.location_type}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {new Intl.NumberFormat('bg-BG', {
                          style: 'currency',
                          currency: property.currency || 'BGN'
                        }).format(property.price)}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <div className="flex gap-2 justify-end items-center">
                          <Link
                            to={`/admin/properties/${property.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <PencilIcon className="w-5 h-5" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 mt-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex relative items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Предишна
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex relative items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Следваща
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Страница <span className="font-medium">{currentPage}</span> от{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex isolate -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex relative items-center px-2 py-2 text-gray-400 dark:text-gray-500 rounded-l-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Предишна</span>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex relative items-center px-2 py-2 text-gray-400 dark:text-gray-500 rounded-r-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Следваща</span>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
