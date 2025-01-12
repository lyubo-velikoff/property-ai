import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '../services/contact';
import { event } from '../lib/analytics';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    general?: string;
  }>({});

  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      event({
        action: 'contact_form_submit',
        category: 'Contact',
        label: 'Success',
        value: 1
      });
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Възникна грешка. Моля, опитайте отново.' });
      }
      event({
        action: 'contact_form_error',
        category: 'Contact',
        label: error.response?.data?.message || 'Unknown error'
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section with Office Image */}
          <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl">
            <img
              src="/images/contact.jpg"
              alt="Авалон Недвижими Имоти Office Entrance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Свържете се с нас
              </h1>
              <p className="text-xl text-gray-200">
                Посетете нашия офис или се свържете с нас онлайн
              </p>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.8747368506897!2d23.321409776882714!3d42.69580097116491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8682cb317bf5%3A0x9cfae3249632c7f4!2sul.%20%22Tsar%20Asen%22%2095%2C%201463%20Sofia%20Center%2C%20Sofia!5e0!3m2!1sen!2sbg!4v1709305169089!5m2!1sen!2sbg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                Изпратете ни съобщение
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Име
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm transition-colors duration-200
                      ${errors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                      } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Имейл
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm transition-colors duration-200
                      ${errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                      } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Съобщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm transition-colors duration-200
                      ${errors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                      } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                  )}
                </div>

                {errors.general && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                )}

                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Благодарим ви! Ще се свържем с вас възможно най-скоро.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {mutation.isPending ? 'Изпращане...' : 'Изпрати'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                Информация за контакт
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Адрес</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    ул. "Цар Асен" 95<br />
                    София 1000<br />
                    България
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Телефони</h3>
                  <div className="mt-2 space-y-2">
                    <a 
                      href="tel:+35921234567"
                      className="block text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      +359 2 123 4567
                    </a>
                    <a 
                      href="tel:+359888123456"
                      className="block text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      +359 888 123 456
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Имейл</h3>
                  <a 
                    href="mailto:office@avalon.bg"
                    className="mt-2 block text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    office@avalon.bg
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Работно време</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      Понеделник - Петък: 9:00 - 18:00
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Събота: 10:00 - 14:00
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Неделя: Затворено
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
