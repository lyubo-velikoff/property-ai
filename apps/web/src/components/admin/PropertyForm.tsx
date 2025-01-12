import { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Property, PropertyFormData } from '../../types/api';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

const propertyTypes = ['APARTMENT', 'HOUSE', 'OFFICE', 'STORE', 'LAND'] as const;
const constructionTypes = ['BRICK', 'PANEL', 'EPK', 'CONCRETE'] as const;
const furnishingTypes = ['UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED'] as const;

export default function PropertyForm({ initialData, onSubmit, isLoading, submitLabel }: PropertyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'EUR',
    area_sqm: initialData?.area_sqm || 0,
    floor: initialData?.floor,
    construction_type: initialData?.construction_type,
    furnishing: initialData?.furnishing,
    location: initialData?.location || '',
    category: initialData?.category || 'SALE',
    type: initialData?.type || 'APARTMENT',
    contact_info: {
      phone: initialData?.contact_info?.phone || '',
      email: initialData?.contact_info?.email || ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'contact_info') {
        data.append(key, JSON.stringify(value));
      } else if (key === 'price' || key === 'area_sqm' || key === 'floor') {
        // Convert numeric values to numbers before sending
        data.append(key, value !== undefined && value !== '' ? String(Number(value)) : '');
      } else if (key === 'category' || key === 'type') {
        // Convert category and type values to uppercase
        data.append(key, String(value).toUpperCase());
      } else if (key !== 'images') {
        data.append(key, String(value));
      }
    });

    // Append new images
    imageFiles.forEach((file) => {
      data.append('images', file);
    });

    // Append existing image IDs if editing
    if (initialData) {
      data.append('existingImages', JSON.stringify(existingImages.map(img => img.id)));
    }

    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Възникна грешка при обработката на формата' });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_info.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contact_info: { ...prev.contact_info, [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : '' }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter(img => img.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Заглавие
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Локация
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.location ? 'border-red-500' : ''
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Тип имот
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'APARTMENT' ? 'Апартамент' :
                   type === 'HOUSE' ? 'Къща' :
                   type === 'OFFICE' ? 'Офис' :
                   type === 'STORE' ? 'Магазин' :
                   'Парцел'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="SALE">Продажба</option>
              <option value="RENT">Наем</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Цена
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleNumberChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.price ? 'border-red-500' : ''
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Валута
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="BGN">BGN</option>
            </select>
          </div>

          <div>
            <label htmlFor="area_sqm" className="block text-sm font-medium text-gray-700">
              Площ (кв.м)
            </label>
            <input
              type="number"
              id="area_sqm"
              name="area_sqm"
              value={formData.area_sqm}
              onChange={handleNumberChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.area_sqm ? 'border-red-500' : ''
              }`}
            />
            {errors.area_sqm && (
              <p className="mt-1 text-sm text-red-600">{errors.area_sqm}</p>
            )}
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
              Етаж
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor || ''}
              onChange={handleNumberChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="construction_type" className="block text-sm font-medium text-gray-700">
              Конструкция
            </label>
            <select
              id="construction_type"
              name="construction_type"
              value={formData.construction_type || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Изберете...</option>
              {constructionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700">
              Обзавеждане
            </label>
            <select
              id="furnishing"
              name="furnishing"
              value={formData.furnishing || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Изберете...</option>
              {furnishingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700">
              Телефон за контакт
            </label>
            <input
              type="tel"
              id="contact_info.phone"
              name="contact_info.phone"
              value={formData.contact_info.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors['contact_info.phone'] ? 'border-red-500' : ''
              }`}
            />
            {errors['contact_info.phone'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contact_info.phone']}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700">
              Имейл за контакт
            </label>
            <input
              type="email"
              id="contact_info.email"
              name="contact_info.email"
              value={formData.contact_info.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors['contact_info.email'] ? 'border-red-500' : ''
              }`}
            />
            {errors['contact_info.email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contact_info.email']}</p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Снимки</label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="Property"
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images Upload */}
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 hover:text-primary-500"
                >
                  <span>Качи снимки</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    ref={fileInputRef}
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">или ги провлачете тук</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={preview} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.general && (
          <p className="text-sm text-red-600">{errors.general}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Отказ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Зареждане...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
} 
