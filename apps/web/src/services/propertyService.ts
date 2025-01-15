import type {
  Property,
  PropertyResponse,
  PropertiesResponse,
  GetPropertiesParams,
  PropertyType,
  PropertyCategory,
  LocationType,
  Currency
} from '@avalon/shared-types';

const API_URL = import.meta.env.VITE_API_URL;

export type { Property, PropertyResponse, PropertiesResponse, GetPropertiesParams, PropertyType, PropertyCategory, LocationType, Currency };

export interface PropertyFilters {
  type?: PropertyType;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: PropertyCategory;
  location_type?: LocationType;
  search?: string;
}

export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 9
): Promise<PropertiesResponse> {
  const params = new URLSearchParams();
  
  // Add filters to query params
  if (filters.type) params.append('type', filters.type);
  if (filters.region) params.append('region', filters.region);
  if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
  if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
  if (filters.category) params.append('category', filters.category);
  if (filters.location_type) params.append('location_type', filters.location_type);
  if (filters.search) params.append('search', filters.search);
  
  // Add pagination params
  params.append('page', page.toString());
  params.append('limit', pageSize.toString());

  try {
    const response = await fetch(`${API_URL}/properties?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${API_URL}/properties/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured properties');
    }
    const data = await response.json();
    return data.data.properties;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  if (!id) {
    throw new Error('Invalid property ID');
  }

  try {
    const response = await fetch(`${API_URL}/properties/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch property');
    }

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    if (!data.data?.property) {
      throw new Error('Property not found');
    }

    return data.data.property;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch property details');
  }
}

export async function deleteProperty(id: string): Promise<void> {
  if (!id) {
    throw new Error('Invalid property ID');
  }

  try {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete property');
    }
  } catch (error) {
    console.error('Failed to delete property:', error);
    throw error instanceof Error ? error : new Error('Failed to delete property');
  }
} 
