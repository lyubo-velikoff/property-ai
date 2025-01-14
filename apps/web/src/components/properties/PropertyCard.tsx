import { Link } from 'react-router-dom';
import { propertyTypeLabels, locationTypeLabels, categoryLabels } from '../../constants/property';

export interface PropertyCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  area_sqm: number;
  type: string;
  category: string;
  location_type: 'CITY' | 'REGION';
  images?: Array<{ url: string }>;
  features?: Array<{ featureId: number; name: string }>;
  floor?: number;
  total_floors?: number;
  construction_type?: string;
  furnishing?: string;
  has_regulation?: boolean;
  land_area_sqm?: number;
}

export default function PropertyCard({
  id,
  title,
  description,
  price,
  currency,
  area_sqm,
  type,
  category,
  location_type,
  images,
}: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency || 'BGN',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link
      to={`/properties/${id}`}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl dark:shadow-gray-800 bg-white dark:bg-gray-800"
    >
      <div className="relative flex-shrink-0 h-48">
        <img
          src={images?.[0]?.url || '/images/property-placeholder.webp'}
          alt={title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/images/property-placeholder.webp';
          }}
        />
        <div className="absolute -bottom-3 right-4">
          <span className="inline-flex px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm">
            {categoryLabels[category] || category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {area_sqm} м²
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{propertyTypeLabels[type] || type}</span>
            <span>{locationTypeLabels[location_type] || location_type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 
