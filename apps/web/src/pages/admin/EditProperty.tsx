import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProperty, updateProperty } from '../../services/properties';
import PropertyForm from '../../components/admin/PropertyForm';
import type { CreatePropertyData } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner';

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
        <h2 className="text-2xl font-semibold text-gray-900">Имотът не е намерен</h2>
        <p className="mt-2 text-gray-600">Този имот не съществува или е бил изтрит</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Редактиране на имот</h1>
        <p className="mt-2 text-sm text-gray-600">
          Редактирайте информацията за имота
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
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
