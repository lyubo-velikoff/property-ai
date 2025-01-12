import api from '../lib/api';
import type { ApiResponse, Property, PaginatedResponse } from '../types/api';

export interface PropertyFilters {
  type?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export async function getProperties(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(`/properties?${params}`);
  return response.data;
}

export async function getAdminProperties(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const response = await api.get<PaginatedResponse<Property>>(`/admin/properties?${params}`);
  return response.data;
}

export async function getProperty(id: string) {
  const response = await api.get<{ property: Property }>(`/admin/properties/${id}`);
  return response.data;
}

export async function createProperty(data: FormData) {
  const response = await api.post<ApiResponse<Property>>('/admin/properties', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateProperty(id: string, data: FormData) {
  const response = await api.patch<ApiResponse<Property>>(`/admin/properties/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteProperty(id: string) {
  const response = await api.delete<ApiResponse<void>>(`/admin/properties/${id}`);
  return response.data;
} 
