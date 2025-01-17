import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/users';
import { event } from '../../lib/analytics';
import type { User } from '@avalon/shared-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Pagination, usePagination } from '@avalon/shared-ui';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Users() {
  const queryClient = useQueryClient();

  const {
    data: users,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage
  } = usePagination<User>({
    pageSize: 10,
    fetchData: async (page, pageSize) => {
      const response = await getUsers(page, pageSize);
      return {
        data: response.users,
        totalPages: response.meta.totalPages
      };
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      event({
        action: 'delete_user',
        category: 'users',
        label: 'User deleted successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      event({
        action: 'delete_user_error',
        category: 'users',
        label: error instanceof Error ? error.message : 'Unknown error'
      });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewUserClick = () => {
    event({
      action: 'user_create_click',
      category: 'Admin',
      label: 'New User Button Click'
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Потребители</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Списък с всички потребители в системата
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="new"
            onClick={handleNewUserClick}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            Нов потребител
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 dark:ring-[rgb(var(--color-dark-border))] md:rounded-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-4">
                  Възникна грешка при зареждането на потребителите: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
              ) : users?.length ? (
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
                          Роля
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                          Дата на регистрация
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Действия</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-[rgb(var(--color-dark-bg-secondary))] dark:divide-[rgb(var(--color-dark-border))]">
                      {users.map((user: User) => (
                        <tr key={user.id}>
                          <td className="px-3 py-4 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))] whitespace-nowrap">
                            {user.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] whitespace-nowrap">
                            {user.role === 'ADMIN' ? 'Администратор' : 'Потребител'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString('bg-BG')}
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/users/${user.id}/edit`}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
                              >
                                <PencilIcon className="w-5 h-5" aria-hidden="true" />
                              </Link>
                              <button
                                onClick={() => handleDelete(user.id)}
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
                    Няма намерени потребители
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
