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
  currency: 'BGN' | 'EUR' | 'USD';
  area_sqm: number;
  land_area_sqm?: number;
  floor?: number;
  total_floors?: number;
  construction_type?: 'BRICK' | 'PANEL' | 'EPK' | 'CONCRETE' | 'STEEL' | 'WOOD';
  furnishing?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  location_type: 'CITY' | 'SUBURB' | 'VILLAGE' | 'SEASIDE' | 'MOUNTAIN';
  category: 'SALE' | 'RENT';
  type: 'APARTMENT' | 'HOUSE' | 'PLOT' | 'COMMERCIAL' | 'INDUSTRIAL';
  featured?: boolean;
  contact_info?: ContactInfo;
  images?: Image[];
  region_id?: number;
  neighborhood_id?: number;
  region?: Location;
  neighborhood?: Location;
  has_regulation?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR' | 'USD';
  area_sqm: number;
  land_area_sqm?: number;
  floor?: number;
  total_floors?: number;
  construction_type?: 'BRICK' | 'PANEL' | 'EPK' | 'CONCRETE' | 'STEEL' | 'WOOD';
  furnishing?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  location_type?: 'CITY' | 'SUBURB' | 'VILLAGE' | 'SEASIDE' | 'MOUNTAIN';
  category?: 'SALE' | 'RENT';
  type?: 'APARTMENT' | 'HOUSE' | 'PLOT' | 'COMMERCIAL' | 'INDUSTRIAL';
  featured?: boolean;
  contact_info?: {
    phone: string;
    email: string;
  };
  region_id?: number;
  neighborhood_id?: number;
  has_regulation?: boolean;
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {} 
