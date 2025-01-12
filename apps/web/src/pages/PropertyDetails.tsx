import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { getPropertyById } from '../services/propertyService';
import { PropertyCardProps } from '../components/properties/PropertyCard';
import GoogleMap from '../components/maps/GoogleMap';
import { useQuery } from '@tanstack/react-query';

interface PropertyImage {
  url: string;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
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

  const handleImageClick = (index: number) => {
    setActiveImage(index);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/properties"
          className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
        >
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Обратно към всички имоти
        </Link>

        {/* Property Title */}
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {property.title}
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <img
                  src={property.images[activeImage]?.url || '/images/property-placeholder.webp'}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
              </div>
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.map((img: PropertyImage, index: number) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Property view ${index + 1}`}
                      className={`w-24 h-24 object-cover cursor-pointer rounded ${
                        index === activeImage ? 'border-2 border-primary-600' : ''
                      }`}
                      onClick={() => handleImageClick(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6 mt-8 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Детайли за имота
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {property.area_sqm && (
                    <p className="flex gap-2 items-center text-gray-600 dark:text-gray-300">
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span>Квадратура: {property.area_sqm} кв.м.</span>
                    </p>
                  )}
                  {property.floor && (
                    <p className="flex gap-2 items-center text-gray-600 dark:text-gray-300">
                      <HomeIcon className="w-5 h-5" />
                      <span>Етаж: {property.floor}</span>
                    </p>
                  )}
                  {property.location && (
                    <p className="flex gap-2 items-center text-gray-600 dark:text-gray-300">
                      <MapPinIcon className="w-5 h-5" />
                      <span>Локация: {property.location}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  {property.construction_type && (
                    <p className="flex gap-2 items-center text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Строителство:</span>
                      {property.construction_type}
                    </p>
                  )}
                  {property.furnishing && (
                    <p className="flex gap-2 items-center text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Обзавеждане:</span>
                      {property.furnishing}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <div className="mb-4 text-3xl font-bold text-red-600">
                {property.price}
                <span className="ml-1 text-xl">{property.currency}</span>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 w-full text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
                >
                  Изпратете запитване
                </button>
                <div className="space-y-2">
                  <a
                    href="tel:082519851"
                    className="flex gap-2 items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    082/51-98-51
                  </a>
                  <a
                    href="tel:0895606165"
                    className="flex gap-2 items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    0895606165
                  </a>
                  <a
                    href="mailto:avalon_ds@abv.bg"
                    className="flex gap-2 items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    avalon_ds@abv.bg
                  </a>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Локация
              </h3>
              <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <GoogleMap
                  center={{
                    lat: 43.849699, // TODO: Get actual property coordinates
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
            <div className="p-6 w-full max-w-md bg-white rounded-lg dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Изпратете запитване
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Име
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Имейл
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Съобщение
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Изпрати
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
