import { 
  PropertyType, 
  PropertyCategory, 
  LocationType, 
  Currency, 
  ConstructionType, 
  FurnishingType 
} from './enums';
import type { Location } from '../location';

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  area_sqm: number;
  floor?: number;
  construction_type?: ConstructionType;
  furnishing?: FurnishingType;
  location_type: LocationType;
  category: PropertyCategory;
  type: PropertyType;
  featured?: boolean;
  contact_info?: ContactInfo;
  images?: Image[];
  region_id?: number;
  neighborhood_id?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  area_sqm: number;
  floor?: number;
  construction_type?: ConstructionType;
  furnishing?: FurnishingType;
  location_type?: LocationType;
  category?: PropertyCategory;
  type?: PropertyType;
  featured?: boolean;
  contact_info?: {
    phone: string;
    email: string;
  };
  region_id?: number;
  neighborhood_id?: number;
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {} 
