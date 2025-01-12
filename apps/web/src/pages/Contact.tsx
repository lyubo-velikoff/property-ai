import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '../services/contact';
import { event } from '../lib/analytics';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      
      // Track successful form submission
      event({
        action: 'contact_form_submit',
        category: 'Contact',
        label: 'Success',
        value: 1
      });

      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Възникна грешка при изпращането на съобщението' });
      }

      // Track form submission error
      event({
        action: 'contact_form_error',
        category: 'Contact',
        label: error.response?.data?.message || 'Unknown error',
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Свържете се с нас</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Име
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Имейл
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Съобщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              {errors.general && (
                <p className="text-sm text-red-600">{errors.general}</p>
              )}

              {success && (
                <p className="text-sm text-green-600">
                  Благодарим ви! Ще се свържем с вас възможно най-скоро.
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {mutation.isPending ? 'Изпращане...' : 'Изпрати'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Адрес</h2>
              <p className="mt-1 text-gray-600">
                ул. "Примерна" 123<br />
                София 1000<br />
                България
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Телефони</h2>
              <p className="mt-1 text-gray-600">
                +359 2 123 4567<br />
                +359 888 123 456
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Имейл</h2>
              <p className="mt-1 text-gray-600">
                office@avalon.bg
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Работно време</h2>
              <p className="mt-1 text-gray-600">
                Понеделник - Петък: 9:00 - 18:00<br />
                Събота: 10:00 - 14:00<br />
                Неделя: Затворено
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
