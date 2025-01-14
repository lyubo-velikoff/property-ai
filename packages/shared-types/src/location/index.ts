import { PaginatedResponse } from '../common/pagination';

/**
 * Feature type
 */
export enum FeatureType {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  BUILDING = 'BUILDING'
}

/**
 * Base location interface
 */
export interface Location {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Region interface
 */
export interface Region extends Location {}

/**
 * Neighborhood interface
 */
export interface Neighborhood extends Location {}

/**
 * Feature interface
 */
export interface Feature {
  id: number;
  name: string;
  type: FeatureType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Location creation input
 */
export interface CreateLocationInput {
  name: string;
}

/**
 * Feature creation input
 */
export interface CreateFeatureInput {
  name: string;
  type: FeatureType;
}

/**
 * Region response
 */
export interface RegionResponse {
  region: Region;
}

/**
 * Regions list response
 */
export interface RegionsResponse {
  regions: Region[];
}

/**
 * Neighborhood response
 */
export interface NeighborhoodResponse {
  neighborhood: Neighborhood;
}

/**
 * Neighborhoods list response
 */
export interface NeighborhoodsResponse {
  neighborhoods: Neighborhood[];
}

/**
 * Feature response
 */
export interface FeatureResponse {
  feature: Feature;
}

/**
 * Features list response
 */
export interface FeaturesResponse {
  features: Feature[];
} 
