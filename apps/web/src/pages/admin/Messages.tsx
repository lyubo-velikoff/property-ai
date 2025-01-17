import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, markMessageAsRead, deleteMessage } from '../../services/messages';
import type { ContactMessage } from '@avalon/shared-types';
import { Pagination, usePagination } from '@avalon/shared-ui';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Messages() {
  const queryClient = useQueryClient();

  const {
    data: messages,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage
  } = usePagination<ContactMessage>({
    pageSize: 10,
    fetchData: async (page, pageSize) => {
      const response = await getMessages(page, pageSize);
      return {
        data: response.data.messages,
        totalPages: response.data.meta.totalPages
      };
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
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
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-4">
                  Възникна грешка при зареждането на съобщенията
                </div>
              ) : messages?.length ? (
                <>
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
                      {messages.map((message: ContactMessage) => (
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
                            <div className="flex justify-end space-x-4">
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
                              <button
                                onClick={() => handleDelete(message.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Изтрий
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Няма съобщения
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
