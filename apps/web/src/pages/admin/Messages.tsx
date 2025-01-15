import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getMessages, markMessageAsRead, deleteMessage } from '../../services/messages';
import { event } from '../../lib/analytics';
import type { ContactMessage } from '@avalon/shared-types';

export default function Messages() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['messages', page],
    queryFn: () => getMessages(page, limit),
  });

  const markAsReadMutation = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      
      // Track successful message mark as read
      event({
        action: 'message_mark_read',
        category: 'Admin',
        label: 'Success'
      });
    },
    onError: (error: any) => {
      // Track message mark as read error
      event({
        action: 'message_mark_read_error',
        category: 'Admin',
        label: error.response?.data?.message || 'Unknown error'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      
      // Track successful message deletion
      event({
        action: 'message_delete',
        category: 'Admin',
        label: 'Success'
      });
    },
    onError: (error: any) => {
      // Track message deletion error
      event({
        action: 'message_delete_error',
        category: 'Admin',
        label: error.response?.data?.message || 'Unknown error'
      });
    }
  });

  const handleMarkAsRead = async (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете това съобщение?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Възникна грешка при зареждането на съобщенията
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Съобщения</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Списък с всички съобщения от контактната форма
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 dark:ring-[rgb(var(--color-dark-border))] md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-[rgb(var(--color-dark-border))]">
                <thead className="bg-gray-50 dark:bg-[rgb(var(--color-dark-bg-secondary))]">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Име
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Имейл
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Съобщение
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                      Дата
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-[rgb(var(--color-dark-bg-secondary))] dark:divide-[rgb(var(--color-dark-border))]">
                  {data?.items.map((message: ContactMessage) => (
                    <tr key={message.id} className={message.isRead ? 'bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]' : 'bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))]'}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                        {message.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                        {message.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                        {message.message}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
                        {new Date(message.createdAt).toLocaleDateString('bg-BG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className={`${
                            message.isRead 
                              ? 'text-gray-400 dark:text-[rgb(var(--color-dark-text-secondary))]' 
                              : 'text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400'
                          }`}
                        >
                          {message.isRead ? 'Прочетено' : 'Маркирай като прочетено'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Предишна
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!data?.hasNextPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Следваща
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Показване на <span className="font-medium">{((page - 1) * limit) + 1}</span> до{' '}
              <span className="font-medium">
                {Math.min(page * limit, data?.total || 0)}
              </span>{' '}
              от <span className="font-medium">{data?.total}</span> резултата
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Предишна</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data?.hasNextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Следваща</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 
