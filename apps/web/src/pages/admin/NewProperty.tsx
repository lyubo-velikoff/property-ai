import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperty } from '../../services/properties';
import PropertyForm from '../../components/admin/PropertyForm';
import type { CreatePropertyData } from '../../types/api';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { event } from '../../lib/analytics';

export default function NewProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ data, images }: { data: CreatePropertyData; images: File[] }) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      images.forEach((image) => {
        formData.append('images', image);
      });
      return createProperty(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate('/admin/properties');
      
      event({
        action: 'property_create',
        category: 'Admin',
        label: 'Success'
      });
    },
    onError: (error: any) => {
      event({
        action: 'property_create_error',
        category: 'Admin',
        label: error.message || 'Unknown error'
      });
    }
  });

  const handleSubmit = async (data: CreatePropertyData, images: File[]) => {
    mutate({ data, images });
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Нов имот</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Добавете нов имот в системата
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/50">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Възникна грешка при създаването на имота
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {error instanceof Error ? error.message : 'Unknown error'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <PropertyForm
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                submitLabel="Създай"
                onCancel={() => navigate('/admin/properties')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
