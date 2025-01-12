import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, HomeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export interface PropertyCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR' | 'USD';
  area_sqm: number;
  floor?: number;
  construction_type?: string;
  furnishing?: string;
  location: string;
  category: 'SALE' | 'RENT';
  type: 'APARTMENT' | 'HOUSE' | 'OFFICE' | 'STORE' | 'LAND';
  featured?: boolean;
  images: Array<{ url: string }>;
  contact_info: {
    phone: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function PropertyCard({
  id,
  title,
  price,
  currency,
  area_sqm,
  location,
  images,
  type,
  category
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedPrice = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);

  const displayType = type.charAt(0) + type.slice(1).toLowerCase();
  const displayCategory = category === 'RENT' ? 'Под наем' : 'За продажба';

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !images[0]?.url ? '/images/property-placeholder.webp' : images[0].url;

  return (
    <Link to={`/properties/${id}`} className="group">
      <div className="relative overflow-hidden bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={imageUrl}
            alt={title}
            onError={handleImageError}
            className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded">
              {displayCategory}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white">
            {title}
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <span>{displayType}</span>
            <span>{area_sqm} м²</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-red-600 dark:text-red-500">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 
