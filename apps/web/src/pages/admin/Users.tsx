import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/users';
import { event } from '../../lib/analytics';
import type { User } from '@prisma/client';

export default function Users() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page, limit),
    // Add staleTime to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  // Show loading state
  if (isLoading || !data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Потребители</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Списък с всички потребители в системата
            </p>
          </div>
        </div>
        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
          Зареждане на потребители...
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Потребители</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Списък с всички потребители в системата
            </p>
          </div>
        </div>
        <div className="p-4 text-center text-red-600 dark:text-red-400">
          Възникна грешка при зареждането на потребителите: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data?.data?.users?.length) {
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
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" />
              Нов потребител
            </Link>
          </div>
        </div>
        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
          Няма намерени потребители
        </div>
      </div>
    );
  }

  // Show users table
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
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" />
            Нов потребител
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 shadow md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Име
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Имейл
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Роля
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Дата на регистрация
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {data?.data?.users.map((user: User) => (
                    <tr key={user.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-100 sm:pl-6">
                        {user.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">{user.email}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {user.role === 'ADMIN' ? 'Администратор' : 'Потребител'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('bg-BG')}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Изтрий
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
