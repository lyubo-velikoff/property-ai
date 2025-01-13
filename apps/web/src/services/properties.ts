import api from '../lib/api';
import type { Property, CreatePropertyData } from '../types/api';

interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  pages: number;
}

interface PropertyResponse {
  property: Property;
}

export async function getProperties(page: number, limit: number): Promise<PropertiesResponse> {
  const response = await api.get<PropertiesResponse>(`/admin/properties?page=${page}&limit=${limit}`);
  return response.data;
}

export async function getProperty(id: string): Promise<Property> {
  const response = await api.get<PropertyResponse>(`/admin/properties/${id}`);
  return response.data.property;
}

export async function createProperty(data: FormData): Promise<Property> {
  const response = await api.post<PropertyResponse>('/admin/properties', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.property;
}

export async function updateProperty(id: string, data: FormData): Promise<Property> {
  const response = await api.patch<PropertyResponse>(`/admin/properties/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.property;
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/admin/properties/${id}`);
} 
