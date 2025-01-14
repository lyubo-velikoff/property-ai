import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { getPropertyById } from '../services/propertyService';
import { PropertyCardProps } from '../components/properties/PropertyCard';
import GoogleMap from '../components/maps/GoogleMap';
import { useQuery } from '@tanstack/react-query';
import { propertyTypeLabels, locationTypeLabels, categoryLabels } from '../constants/property';

interface PropertyImage {
  url: string;
}

interface Feature {
  featureId: number;
  name: string;
}

interface Property extends PropertyCardProps {
  images?: PropertyImage[];
  features?: Feature[];
  floor?: number;
  total_floors?: number;
  construction_type?: string;
  furnishing?: string;
  has_regulation?: boolean;
  land_area_sqm?: number;
}

function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Validate ID and navigate if invalid
  useEffect(() => {
    if (!id) {
      navigate('/404');
    }
  }, [id, navigate]);

  // Only proceed with the query if we have a valid ID
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id!),
    enabled: !!id, // Only run query if ID exists
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    setShowContactForm(false);
  };

  const handleImageClick = (index: number) => {
    setActiveImage(index);
    setShowFullscreen(true);
  };

  const handleFullscreenClose = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the image
    if (e.target === e.currentTarget) {
      setShowFullscreen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showFullscreen || !property?.images) return;
    
    if (e.key === 'Escape') {
      setShowFullscreen(false);
    } else if (e.key === 'ArrowLeft') {
      setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen, property]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Failed to load property details</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white rounded bg-primary-600 hover:bg-primary-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Property not found</h2>
        <Link 
          to="/properties"
          className="px-4 py-2 text-white rounded bg-primary-600 hover:bg-primary-700"
        >
          View All Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/properties"
          className="inline-flex items-center mb-6 text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] hover:text-primary-600 dark:hover:text-primary-500"
        >
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Обратно към всички имоти
        </Link>

        {/* Property Title */}
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
          {property.title}
        </h1>

        {/* Property Description */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] whitespace-pre-wrap">
            {property.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="space-y-4">
            <div className="overflow-hidden relative w-full rounded-lg" onClick={() => setShowFullscreen(true)}>
                <img
                  src={property.images?.[activeImage]?.url || '/images/property-placeholder.webp'}
                  alt={property.title}
                  className="object-cover w-full h-auto rounded-lg cursor-pointer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/property-placeholder.webp';
                  }}
                />
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1));
                      }}
                      className="absolute left-2 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/75"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev === (property.images?.length || 1) - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-2 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/75"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 px-3 py-1 text-sm text-white rounded-full -translate-x-1/2 bg-black/50">
                      {activeImage + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {property.images.map((img: PropertyImage, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg transition-all ${
                        index === activeImage ? 'ring-2 ring-primary-600 opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Property view ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/property-placeholder.webp';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow dark:bg-[rgb(var(--color-dark-bg-secondary))]">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Детайли за имота</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Тип имот</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                    {propertyTypeLabels[property.type] || property.type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Категория</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                    {categoryLabels[property.category] || property.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Тип локация</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                    {locationTypeLabels[property.location_type] || property.location_type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Площ</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.area_sqm} м²</p>
                </div>
                {property.land_area_sqm && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Площ на парцела</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.land_area_sqm} м²</p>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Етаж</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.floor} от {property.total_floors || '?'}</p>
                  </div>
                )}
                {property.construction_type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Строителство</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.construction_type}</p>
                  </div>
                )}
                {property.furnishing && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Обзавеждане</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.furnishing}</p>
                  </div>
                )}
                {property.has_regulation !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Регулация</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-[rgb(var(--color-dark-text))]">{property.has_regulation ? 'Да' : 'Не'}</p>
                  </div>
                )}
                {property.features && property.features.length > 0 && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">Характеристики</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {property.features.map((feature: Feature) => (
                        <span 
                          key={feature.featureId} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {feature.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
              <div className="mb-4 text-3xl font-bold text-primary-600">
                {formatPrice(property.price)}
                <span className="ml-1 text-xl">{property.currency}</span>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 w-full text-white bg-primary-600 rounded-md transition-colors hover:bg-primary-700"
                >
                  Изпратете запитване
                </button>
                <div className="space-y-2">
                  <a
                    href="tel:082519851"
                    className="flex gap-2 items-center text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    082/51-98-51
                  </a>
                  <a
                    href="tel:0895606165"
                    className="flex gap-2 items-center text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    0895606165
                  </a>
                  <a
                    href="mailto:avalon_ds@abv.bg"
                    className="flex gap-2 items-center text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    avalon_ds@abv.bg
                  </a>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-[rgb(var(--color-dark-bg-secondary))]">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                Локация
              </h3>
              <div className="h-[300px] bg-gray-200 dark:bg-[rgb(var(--color-dark-border))] rounded-lg overflow-hidden">
                <GoogleMap
                  center={{
                    lat: 43.849699,
                    lng: 25.954861,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="p-6 w-full max-w-md bg-white rounded-lg dark:bg-[rgb(var(--color-dark-bg-secondary))]">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
                Изпратете запитване
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Име
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Имейл
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))]">
                    Съобщение
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="block w-full rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text-secondary))] hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    Изпрати
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        {showFullscreen && property.images && (
          <div 
            className="flex fixed inset-0 z-50 justify-center items-center bg-black/90"
            onClick={handleFullscreenClose}
          >
            <div className="flex relative justify-center items-center w-full h-full">
              {/* Close button */}
              <button
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 z-50 p-2 text-white rounded-full transition-colors bg-black/50 hover:bg-black/75"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <div className="flex relative justify-center items-center p-4 w-full h-full">
                <img
                  src={property.images[activeImage]?.url || '/images/property-placeholder.webp'}
                  alt={`Property view ${activeImage + 1}`}
                  className="object-contain max-w-full max-h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/property-placeholder.webp';
                  }}
                />

                {property.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
                      }}
                      className="absolute left-4 p-2 text-white rounded-full transition-colors bg-black/50 hover:bg-black/75"
                    >
                      <ChevronLeftIcon className="w-8 h-8" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-4 p-2 text-white rounded-full transition-colors bg-black/50 hover:bg-black/75"
                    >
                      <ChevronRightIcon className="w-8 h-8" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 px-4 py-2 text-white rounded-full -translate-x-1/2 bg-black/50">
                      {activeImage + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="absolute right-0 bottom-0 left-0 p-4">
                <div className="flex overflow-x-auto gap-2 justify-center pb-2">
                  {property.images.map((img: PropertyImage, index: number) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(index);
                      }}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                        index === activeImage ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/property-placeholder.webp';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
