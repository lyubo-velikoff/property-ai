import { ApiResponse } from '../types/api';
import api from '../lib/api';

export interface Region {
  id: number;
  name: string;
}

export interface Neighborhood {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  type: 'INFRASTRUCTURE' | 'BUILDING';
}

type RegionsData = {
  regions: Region[];
}

type NeighborhoodsData = {
  neighborhoods: Neighborhood[];
}

type FeaturesData = {
  features: Feature[];
}

export async function getRegions(): Promise<Region[]> {
  try {
    const { data } = await api.get<RegionsData>('/locations/regions');
    return data.regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  try {
    const { data } = await api.get<NeighborhoodsData>('/locations/neighborhoods');
    return data.neighborhoods;
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }
}

export async function getFeatures(): Promise<Feature[]> {
  try {
    const { data } = await api.get<FeaturesData>('/locations/features');
    return data.features;
  } catch (error) {
    console.error('Error fetching features:', error);
    return [];
  }
} 
