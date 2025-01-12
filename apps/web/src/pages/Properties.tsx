import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropertyCard, { PropertyCardProps } from '../components/properties/PropertyCard';
import PropertyCardSkeleton from '../components/properties/PropertyCardSkeleton';
import { getProperties, PropertyFilters } from '../services/propertyService';

const propertyTypes = [
  'Всички типове',
  'APARTMENT',
  'HOUSE',
  'OFFICE',
  'STORE',
  'LAND'
];

const propertyTypeLabels: Record<string, string> = {
  'APARTMENT': 'Апартамент',
  'HOUSE': 'Къща',
  'OFFICE': 'Офис',
  'STORE': 'Магазин',
  'LAND': 'Парцел'
};

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

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Get current filters from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentType = searchParams.get('type') || '';
  const currentRegion = searchParams.get('region') || '';
  const currentCategory = searchParams.get('category') as 'RENT' | 'SALE' | undefined;
  const currentMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: PropertyFilters = {
          type: currentType || undefined,
          region: currentRegion || undefined,
          category: currentCategory,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
        };

        const response = await getProperties(filters, currentPage);
        if (response && response.properties) {
          setProperties(response.properties);
          setTotalPages(Math.ceil(response.total / response.pageSize));
        } else {
          setProperties([]);
          setTotalPages(1);
          setError('No properties found');
        }
      } catch (err) {
        setError('Failed to load properties');
        setProperties([]);
        setTotalPages(1);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [currentPage, currentType, currentRegion, currentCategory, currentMinPrice, currentMaxPrice]);

  const handleFilterChange = (filters: Partial<PropertyFilters>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Reset page when filters change
    newParams.set('page', '1');
    
    // Update filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentCategory === 'RENT' ? 'Имоти под наем' : 
             currentCategory === 'SALE' ? 'Имоти за продажба' : 
             'Всички имоти'}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FunnelIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Филтри
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Тип имот
                </label>
                <select
                  value={currentType}
                  onChange={(e) => handleFilterChange({ type: e.target.value })}
                  disabled={isLoading}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Всички типове</option>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Район
                </label>
                <select
                  value={currentRegion}
                  onChange={(e) => handleFilterChange({ region: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                >
                  <option value="">Всички райони</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Минимална цена
                </label>
                <input
                  type="number"
                  value={currentMinPrice || ''}
                  onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Минимална цена"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Максимална цена
                </label>
                <input
                  type="number"
                  value={currentMaxPrice || ''}
                  onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Максимална цена"
                />
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-500 text-lg">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Няма намерени имоти</p>
          </div>
        ) : (
          <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <CSSTransition key={property.id} timeout={300} classNames="fade">
                <PropertyCard {...property} />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 
