import api from '../lib/api';
import type { Property, CreatePropertyData, PropertiesResponse, PropertyResponse } from '../types/api';

export async function getProperties(page: number, limit: number): Promise<PropertiesResponse> {
  const response = await api.get(`/properties?page=${page}&limit=${limit}`);
  return response.data;
}

export async function getProperty(id: string): Promise<Property> {
  const response = await api.get(`/properties/${id}`);
  return response.data.property;
}

export async function createProperty(data: FormData): Promise<Property> {
  const response = await api.post('/properties', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.property;
}

export async function updateProperty(id: string, data: FormData): Promise<Property> {
  const response = await api.patch(`/properties/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.property;
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
} 
