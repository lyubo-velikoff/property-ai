import { useState } from 'react';
import type { CreatePropertyData } from '../../types/api';

interface PropertyFormProps {
  initialData?: Partial<CreatePropertyData>;
  onSubmit: (data: CreatePropertyData, images: File[]) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function PropertyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Запази'
}: PropertyFormProps) {
  const [data, setData] = useState<CreatePropertyData>({
    title: '',
    description: '',
    price: 0,
    currency: 'BGN',
    area_sqm: 0,
    location: '',
    category: 'SALE',
    type: 'APARTMENT',
    contact_info: {
      phone: '',
      email: '',
    },
    ...initialData,
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit(data, images);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Възникна грешка при запазването на имота' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_info.')) {
      const field = name.split('.')[1];
      setData(prev => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [field]: value,
        },
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/50 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Заглавие
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.title 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Цена
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={handleChange}
              className={`block w-full rounded-l-md shadow-sm sm:text-sm ${
                errors.price 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
            />
            <select
              name="currency"
              value={data.currency}
              onChange={handleChange}
              className="rounded-r-md border-l-0 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="BGN">лв.</option>
              <option value="EUR">€</option>
              <option value="USD">$</option>
            </select>
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="area_sqm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Площ (кв.м)
          </label>
          <input
            type="number"
            id="area_sqm"
            name="area_sqm"
            value={data.area_sqm}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.area_sqm 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.area_sqm && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.area_sqm}</p>}
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Етаж
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            value={data.floor || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Локация
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={data.location}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.location 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Тип имот
          </label>
          <select
            id="type"
            name="type"
            value={data.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="APARTMENT">Апартамент</option>
            <option value="HOUSE">Къща</option>
            <option value="OFFICE">Офис</option>
            <option value="STORE">Магазин</option>
            <option value="LAND">Парцел</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Категория
          </label>
          <select
            id="category"
            name="category"
            value={data.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="SALE">Продажба</option>
            <option value="RENT">Наем</option>
          </select>
        </div>

        <div>
          <label htmlFor="construction_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Вид строителство
          </label>
          <input
            type="text"
            id="construction_type"
            name="construction_type"
            value={data.construction_type || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Обзавеждане
          </label>
          <input
            type="text"
            id="furnishing"
            name="furnishing"
            value={data.furnishing || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.description 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Телефон за контакт
          </label>
          <input
            type="tel"
            id="contact_info.phone"
            name="contact_info.phone"
            value={data.contact_info.phone}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors['contact_info.phone'] 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors['contact_info.phone'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact_info.phone']}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Имейл за контакт
          </label>
          <input
            type="email"
            id="contact_info.email"
            name="contact_info.email"
            value={data.contact_info.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors['contact_info.email'] 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors['contact_info.email'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact_info.email']}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Снимки
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/50 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/75"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Отказ
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Запазване...' : submitLabel}
        </button>
      </div>
    </form>
  );
} 
