import { PropertyCardProps } from '../components/properties/PropertyCard';

const API_URL = import.meta.env.VITE_API_URL;

export interface PropertyFilters {
  type?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: 'RENT' | 'SALE';
  location_type?: 'CITY' | 'REGION';
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  pages: number;
  pageSize: number;
}

interface PropertyImage {
  url: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR' | 'USD';
  area_sqm: number;
  floor?: number;
  construction_type?: string;
  furnishing?: string;
  location_type: 'CITY' | 'REGION';
  category: 'SALE' | 'RENT';
  type: 'APARTMENT' | 'HOUSE' | 'PLOT' | 'COMMERCIAL' | 'INDUSTRIAL';
  images?: Array<{ id: string; url: string }>;
  contact_info: {
    id: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 9
): Promise<PropertyResponse> {
  const params = new URLSearchParams();
  
  // Add filters to query params
  if (filters.type) params.append('type', filters.type);
  if (filters.region) params.append('region', filters.region);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.category) params.append('category', filters.category);
  if (filters.location_type) params.append('location_type', filters.location_type);
  
  // Add pagination params
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  try {
    const response = await fetch(`${API_URL}/properties?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const data = await response.json();
    return {
      properties: data.data?.properties || [],
      total: data.data?.total || 0,
      page: data.data?.page || 1,
      pages: data.data?.pages || 1,
      pageSize: data.data?.pageSize || pageSize
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

export async function getFeaturedProperties(): Promise<PropertyCardProps[]> {
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
