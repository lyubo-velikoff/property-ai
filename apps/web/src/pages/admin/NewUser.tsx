import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../services/users';
import type { CreateUserData } from '../../types/api';
import { event } from '../../lib/analytics';
import { XCircleIcon } from '@heroicons/react/24/outline';

type UserFormProps = {
  onSubmit: (data: CreateUserData) => void;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
};

function UserForm({ onSubmit, isSubmitting, submitLabel, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
          Име
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
          Имейл
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
          Парола
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
          Роля
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          required
        >
          <option value="USER">Потребител</option>
          <option value="ADMIN">Администратор</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))] bg-white dark:bg-[rgb(var(--color-dark-bg))] border border-gray-300 dark:border-[rgb(var(--color-dark-border))] rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[rgb(var(--color-dark-bg-secondary))]"
        >
          Отказ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function NewUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CreateUserData) => createUser({ ...data, updatedAt: new Date() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/admin/users');
      
      event({
        action: 'user_create',
        category: 'Admin',
        label: 'Success'
      });
    },
    onError: (error: any) => {
      event({
        action: 'user_create_error',
        category: 'Admin',
        label: error.message || 'Unknown error'
      });
    }
  });

  const handleSubmit = async (data: CreateUserData) => {
    mutate(data);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Нов потребител</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Добавете нов потребител в системата
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Информация за потребителя</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Попълнете информацията за потребителя. Всички полета са задължителни.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] shadow sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                {error && (
                  <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/50">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Възникна грешка при създаването на потребителя
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          {error instanceof Error ? error.message : 'Unknown error'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <UserForm
                  onSubmit={handleSubmit}
                  isSubmitting={isPending}
                  submitLabel="Създай"
                  onCancel={() => navigate('/admin/users')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
