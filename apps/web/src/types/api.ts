export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
  location: string;
  category: 'SALE' | 'RENT';
  type: 'APARTMENT' | 'HOUSE' | 'OFFICE' | 'STORE' | 'LAND';
  images: Image[];
  contact_info: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  properties: T[];
  total: number;
  page: number;
  pages: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface PropertyFormData {
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
  contact_info: {
    phone: string;
    email: string;
  };
  images?: File[];
} 
