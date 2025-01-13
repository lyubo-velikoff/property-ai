import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProperty } from '../../services/properties';
import PropertyForm from '../../components/admin/PropertyForm';
import type { CreatePropertyData } from '../../types/api';

export default function NewProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
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

      return createProperty(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate('/admin/properties');
    },
  });

  const handleSubmit = async (data: CreatePropertyData, images: File[]) => {
    mutate({ data, images });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Нов имот</h1>
        <p className="mt-2 text-sm text-gray-600">
          Попълнете информацията за новия имот
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <PropertyForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          onCancel={() => navigate('/admin/properties')}
          submitLabel="Създай имот"
        />
      </div>
    </div>
  );
} 
