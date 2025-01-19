import { Link } from 'react-router-dom';
import { propertyTypeLabels, locationTypeLabels, categoryLabels } from '../../constants/property';
import type { Property, PropertyType, PropertyCategory, LocationType, Currency, ConstructionType, FurnishingType } from '@avalon/shared-types';

export type PropertyCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  area_sqm: number;
  type: PropertyType;
  category: PropertyCategory;
  location_type: LocationType;
  images?: { url: string }[];
  floor?: number;
  total_floors?: number;
  construction_type?: ConstructionType;
  furnishing?: FurnishingType;
  has_regulation?: boolean;
  land_area_sqm?: number;
};

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
      className="flex flex-col overflow-hidden transition-all bg-white rounded-lg shadow-lg hover:shadow-xl dark:shadow-[rgb(var(--color-dark-bg))] dark:bg-[rgb(var(--color-dark-bg-secondary))] group"
    >
      <div className="overflow-hidden relative flex-shrink-0 h-48">
        <img
          src={images?.[0]?.url || '/images/property-placeholder.webp'}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/property-placeholder.webp';
          }}
        />
      </div>
      <div className="z-10 -mt-3 mr-3 text-right">
        <span className="inline-flex px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm">
          {categoryLabels[category] || category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
            {title}
          </h3>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
              {area_sqm} м²
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
            <span>{propertyTypeLabels[type] || type}</span>
            <span>{locationTypeLabels[location_type] || location_type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 
