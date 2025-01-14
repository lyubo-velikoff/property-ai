import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProperty, updateProperty } from '../../services/properties';
import PropertyForm from '../../components/admin/PropertyForm';
import type { CreatePropertyData } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id!),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data, images }: { data: CreatePropertyData; images: File[] }) => {
      const formData = new FormData();
      
      // Append property data
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'contact_info') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append images
      images.forEach((file) => {
        formData.append('image', file);
      });

      return updateProperty(id!, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      navigate('/admin/properties');
    },
  });

  const handleSubmit = async (data: CreatePropertyData, images: File[]) => {
    mutate({ data, images });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Имотът не е намерен</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Този имот не съществува или е бил изтрит</p>
        <button
          onClick={() => navigate('/admin/properties')}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Към списъка с имоти
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Назад
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Редактиране на имот</h1>
        <div className="flex items-center mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Редактирайте информацията за имота
          </p>
          <Link
            to={`/properties/${id}`}
            target="_blank"
            className="ml-4 inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span>Преглед на имота</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          onCancel={() => navigate('/admin/properties')}
          submitLabel="Запази промените"
        />
      </div>
    </div>
  );
} 
