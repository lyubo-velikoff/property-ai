import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createProperty } from '../../services/properties';
import PropertyForm from '../../components/admin/PropertyForm';

export default function NewProperty() {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      navigate('/admin/properties');
    },
  });

  const handleSubmit = async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Нов имот</h1>
        <PropertyForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Създай"
        />
      </div>
    </div>
  );
} 
