import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperty, updateProperty } from '../../services/properties';
import { event } from '../../lib/analytics';
import type { Property } from '../../types/api';
import PropertyForm from '../../components/admin/PropertyForm';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery<{ property: Property }, Error>({
    queryKey: ['property', id],
    queryFn: () => getProperty(id!),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateProperty(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      navigate('/admin/properties');
      
      event({
        action: 'property_update',
        category: 'Admin',
        label: 'Success'
      });
    },
    onError: (error: any) => {
      event({
        action: 'property_update_error',
        category: 'Admin',
        label: error.message || 'Unknown error'
      });
    }
  });

  const handleSubmit = async (formData: FormData) => {
    await updateMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-b-2 border-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="mb-4 text-center text-red-600">
          {error instanceof Error ? error.message : 'Възникна грешка при зареждането на имота'}
        </p>
      </div>
    );
  }

  if (!response?.property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="mb-4 text-center text-red-600">Имотът не е намерен</p>
      </div>
    );
  }

  const property = response.property;
  console.log('Rendering property:', property);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Редактиране на имот</h1>
          <p className="mt-2 text-sm text-gray-700">
            {property.title}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Запази промените"
        />
      </div>
    </div>
  );
} 
