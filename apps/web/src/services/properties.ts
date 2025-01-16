import api from '../lib/api';
import type { Property, CreatePropertyData, PropertiesResponse, PropertyResponse } from '../types/api';

export async function getProperties(page: number, limit: number): Promise<PropertiesResponse> {
  const response = await api.get<{ status: string; data: PropertiesResponse }>(`/admin/properties?page=${page}&limit=${limit}`);
  return response.data.data;
}

export async function getProperty(id: string): Promise<Property> {
  const response = await api.get<{ status: string; data: PropertyResponse }>(`/admin/properties/${id}`);
  return response.data.data.property;
}

export async function createProperty(data: FormData): Promise<Property> {
  const response = await api.post<{ status: string; data: PropertyResponse }>('/admin/properties', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.property;
}

export async function updateProperty(id: string, data: FormData): Promise<Property> {
  const response = await api.patch<{ status: string; data: PropertyResponse }>(`/admin/properties/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.property;
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/admin/properties/${id}`);
} 
