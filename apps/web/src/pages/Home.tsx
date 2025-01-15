import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getFeaturedProperties } from '../services/propertyService';
import type { Property } from '@avalon/shared-types';
import PropertyCard from '../components/properties/PropertyCard';

const propertyTypes = [
  'Всички типове',
  'Апартамент',
  'Къща',
  'Парцел',
  'Търговски имот',
  'Индустриален имот'
];

const regions = [
  'Всички райони',
  'Русе център',
  'Здравец',
  'Дружба',
  'Възраждане',
  'Чародейка',
  'Ялта',
  'Родина',
  'Цветница',
  'Централна градска част',
];

export default function Home() {
  const [selectedType, setSelectedType] = useState('Всички типове');
  const [selectedRegion, setSelectedRegion] = useState('Всички райони');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const properties = await getFeaturedProperties();
        setFeaturedProperties(properties);
      } catch (err) {
        setError('Failed to load featured properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType !== 'Всички типове') params.append('type', selectedType);
    if (selectedRegion !== 'Всички райони') params.append('region', selectedRegion);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Search Overlay */}
      <div className="relative">
        {/* Hero Background */}
        <div className="relative h-[50vh] min-h-[500px] max-h-[600px] bg-gray-900">
          <img
            src="/images/homepage-hero.webp"
            alt="Luxury Real Estate"
            className="object-cover object-center absolute inset-0 w-full h-full opacity-60"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/50 to-gray-900/80" />
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col justify-center">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Намерете своя перфектен дом
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg text-gray-100 sm:max-w-3xl">
                Авалон Недвижими Имоти - Вашият надежден партньор в света на недвижимите имоти от 2008 година.
              </p>
            </div>
          </div>
        </div>

        {/* Search Box Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 transform translate-y-1/2">
          <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] rounded-lg shadow-xl backdrop-blur-sm">
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                      Тип имот
                    </label>
                    <select
                      id="type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-[rgb(var(--color-dark-text))]">
                      Район
                    </label>
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-[rgb(var(--color-dark-border))] focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-[rgb(var(--color-dark-bg))] dark:text-[rgb(var(--color-dark-text))] sm:text-sm"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-3 w-full text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[rgb(var(--color-dark-bg-secondary))]"
                  >
                    <div className="flex justify-center items-center">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      <span className="ml-2">Търсене</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]">
        <div className="px-4 pt-32 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
            Топ Оферти
          </h2>
          <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] rounded-lg shadow-lg animate-pulse">
                  <div className="bg-gray-200 aspect-w-16 aspect-h-9 dark:bg-[rgb(var(--color-dark-border))]" />
                  <div className="p-4">
                    <div className="w-3/4 h-4 bg-gray-200 rounded dark:bg-[rgb(var(--color-dark-border))]" />
                    <div className="mt-4 w-1/2 h-4 bg-gray-200 rounded dark:bg-[rgb(var(--color-dark-border))]" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-sm text-center text-red-700 dark:text-red-300">{error}</p>
              </div>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-[rgb(var(--color-dark-text-secondary))]">
                Няма намерени оферти
              </div>
            )}
          </div>
          {featuredProperties.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                to="/properties"
                className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700"
              >
                Разгледайте всички имоти
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 

