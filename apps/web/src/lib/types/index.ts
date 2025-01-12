export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  area_sqm: number;
  floor?: string;
  construction_type?: string;
  furnishing?: string;
  location: string;
  category: string;
  description: string;
  images: string[];
  contact_info: {
    phone: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'office'
  | 'shop'
  | 'land'
  | 'industrial';

export type PropertyCategory = 
  | 'rent'
  | 'sale';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  created_at: string;
  updated_at: string;
} 
