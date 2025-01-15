import { useState, useEffect } from 'react';
import type { CreatePropertyData, Property } from '../../types/api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { getRegions, getNeighborhoods, getFeatures } from '../../services/locationService';
import { constructionTypes, furnishingTypes, propertyTypes, locationTypes, categories, currencies } from '../../constants/property';

interface PropertyFormProps {
  initialData?: Property;
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
  // Prepare initial data by converting Property type to CreatePropertyData type
  const prepareInitialData = (data?: Property): Partial<CreatePropertyData> => {
    if (!data) return {};
    const { id, createdAt, updatedAt, features, ...rest } = data;
    return {
      ...rest,
      features: features?.map(f => f.featureId),
    };
  };

  const [data, setData] = useState<CreatePropertyData>({
    title: '',
    description: '',
    price: 0,
    currency: 'BGN',
    area_sqm: 0,
    land_area_sqm: undefined,
    floor: undefined,
    total_floors: undefined,
    construction_type: undefined,
    furnishing: undefined,
    location_type: 'CITY',
    regionId: undefined,
    neighborhoodId: undefined,
    has_regulation: false,
    category: 'SALE',
    type: 'APARTMENT',
    featured: false,
    contact_info: {
      phone: '',
      email: '',
    },
    ...prepareInitialData(initialData),
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>(
    initialData?.features?.map(f => f.featureId) || []
  );

  const { 
    data: regions = [], 
    isLoading: regionsLoading, 
    error: regionsError 
  } = useQuery({
    queryKey: ['regions'],
    queryFn: getRegions,
    retry: 3,
    staleTime: 300000, // 5 minutes
  });

  const { 
    data: neighborhoods = [], 
    isLoading: neighborhoodsLoading, 
    error: neighborhoodsError 
  } = useQuery({
    queryKey: ['neighborhoods'],
    queryFn: getNeighborhoods,
    retry: 3,
    staleTime: 300000, // 5 minutes
  });

  const { 
    data: features = [], 
    isLoading: featuresLoading, 
    error: featuresError 
  } = useQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
    retry: 3,
    staleTime: 300000, // 5 minutes
  });

  useEffect(() => {
    if (regionsError) console.error('Regions error:', regionsError);
    if (neighborhoodsError) console.error('Neighborhoods error:', neighborhoodsError);
    if (featuresError) console.error('Features error:', featuresError);
  }, [regionsError, neighborhoodsError, featuresError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit({ ...data, features: selectedFeatures }, images);
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
    } else if (name === 'has_regulation' || name === 'featured') {
      setData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeatureChange = (featureId: number) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      }
      return [...prev, featureId];
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:text-red-200 dark:bg-red-900/50">
          {errors.general}
        </div>
      )}

      <div className="space-y-4">
        {/* Basic Info Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Основна информация</h3>
          <div className="grid grid-cols-1 gap-6">
          <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
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
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
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
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Price & Area Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Цена и площ</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Цена
              </label>
              <div className="flex mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  className={`block w-full rounded-l-md shadow-sm sm:text-sm ${
                    errors.price 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                  } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
                />
                <select
                  name="currency"
                  value={data.currency}
                  onChange={handleChange}
                  className="border-l-0 border-gray-300 rounded-r-md dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:ring-primary-500 focus:border-primary-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="area_sqm" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
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
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
              />
              {errors.area_sqm && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.area_sqm}</p>}
          </div>

          <div>
              <label htmlFor="land_area_sqm" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Площ на парцела (кв.м)
            </label>
            <input
                type="number"
                id="land_area_sqm"
                name="land_area_sqm"
                value={data.land_area_sqm || ''}
              onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Локация</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Тип локация
              </label>
              <select
                id="location_type"
                name="location_type"
                value={data.location_type}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.location_type 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
              >
                {locationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.location_type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location_type}</p>}
            </div>

            <div>
              <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Регион
              </label>
              <select
                id="regionId"
                name="regionId"
                value={data.regionId || ''}
                onChange={handleChange}
                disabled={regionsLoading}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Изберете</option>
                {regionsLoading ? (
                  <option disabled>Зареждане...</option>
                ) : regions?.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
          </div>

          <div>
              <label htmlFor="neighborhoodId" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Квартал
              </label>
              <select
                id="neighborhoodId"
                name="neighborhoodId"
                value={data.neighborhoodId || ''}
                onChange={handleChange}
                disabled={neighborhoodsLoading}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Изберете</option>
                {neighborhoodsLoading ? (
                  <option disabled>Зареждане...</option>
                ) : neighborhoods?.map(neighborhood => (
                  <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Детайли за имота</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
              Тип имот
            </label>
            <select
              id="type"
              name="type"
                value={data.type}
              onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
              Категория
            </label>
            <select
              id="category"
              name="category"
                value={data.category}
              onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
            </select>
          </div>

          <div>
              <label htmlFor="construction_type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Вид строителство
            </label>
            <select
                id="construction_type"
                name="construction_type"
                value={data.construction_type || ''}
              onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Изберете</option>
                {constructionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
            </select>
          </div>

          <div>
              <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Обзавеждане
            </label>
              <select
                id="furnishing"
                name="furnishing"
                value={data.furnishing || ''}
                onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Изберете</option>
                {furnishingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          </div>

        {/* Floor Info & Additional Info */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Етажност и допълнителна информация</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
              Етаж
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
                value={data.floor || ''}
                onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
              <label htmlFor="total_floors" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Общо етажи
            </label>
              <input
                type="number"
                id="total_floors"
                name="total_floors"
                value={data.total_floors || ''}
              onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
          </div>

          <div>
              <label htmlFor="has_regulation" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Има регулация
            </label>
            <select
                id="has_regulation"
                name="has_regulation"
                value={data.has_regulation ? 'yes' : 'no'}
                onChange={(e) => {
                  setData(prev => ({
                    ...prev,
                    has_regulation: e.target.value === 'yes'
                  }));
                }}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-[rgb(var(--color-dark-border))] dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="yes">Да</option>
                <option value="no">Не</option>
            </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={data.featured || false}
                  onChange={handleChange}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:border-[rgb(var(--color-dark-border))]"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">Препоръчан</span>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Контактна информация</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
              <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
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
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
            />
            {errors['contact_info.phone'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact_info.phone']}</p>
            )}
          </div>

          <div>
              <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
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
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))]'
                } dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] focus:border-primary-500 focus:ring-primary-500`}
            />
            {errors['contact_info.email'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['contact_info.email']}</p>
            )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Характеристики</h3>
          {featuresLoading ? (
            <p className="text-sm text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Зареждане на характеристики...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {features?.map(feature => (
                <div key={feature.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))]">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures(prev => [...prev, feature.id]);
                      } else {
                        setSelectedFeatures(prev => prev.filter(id => id !== feature.id));
                      }
                    }}
                    className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:border-[rgb(var(--color-dark-border))]"
                  />
                  <label
                    htmlFor={`feature-${feature.id}`}
                    className="block ml-2 text-sm text-gray-700 cursor-pointer dark:text-[rgb(var(--color-dark-text-secondary))]"
                  >
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          )}
          {featuresError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Грешка при зареждане на характеристиките</p>
          )}
        </div>

        {/* Images Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Изображения</h3>
          {initialData?.images && initialData.images.length > 0 && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Текущи изображения
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {initialData.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={initialData.title}
                      className="object-cover w-full h-32 rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/property-placeholder.webp';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
              {initialData?.images?.length ? 'Добави нови изображения' : 'Изображения'}
            </label>
            <div className="flex justify-center px-6 pt-5 pb-6 mt-1 rounded-md border-2 border-gray-300 border-dashed dark:border-gray-600">
            <div className="space-y-1 text-center">
                <svg
                  className="mx-auto w-12 h-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="images"
                    className="relative font-medium rounded-md cursor-pointer text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Качи файлове</span>
                  <input
                      id="images"
                      name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                      className="sr-only"
                  />
                </label>
                <p className="pl-1">или ги провлачете тук</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP до 10MB
                </p>
              </div>
            </div>
            {images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">Избрани файлове:</h4>
                <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from(images).map((file, index) => (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">{file.name}</span>
                  <button
                    type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                        <XMarkIcon className="w-5 h-5" />
                  </button>
                    </li>
              ))}
                </ul>
            </div>
          )}
          </div>
        </div>

        <div className="flex gap-3 justify-end sm:col-span-2">
          {onCancel && (
          <button
            type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))] bg-white dark:bg-[rgb(var(--color-dark-bg))] border border-gray-300 dark:border-[rgb(var(--color-dark-border))] rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[rgb(var(--color-dark-bg-secondary))]"
          >
            Отказ
          </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || regionsLoading || neighborhoodsLoading || featuresLoading}
            className="px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Запазване...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
} 
