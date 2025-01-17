import { 
  PropertyType, 
  PropertyCategory, 
  LocationType, 
  ConstructionType, 
  FurnishingType 
} from './enums';

export interface GetPropertiesParams {
  page?: string;
  limit?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
  type?: PropertyType;
  category?: PropertyCategory;
  location_type?: LocationType;
  construction_type?: ConstructionType;
  furnishing?: FurnishingType;
  featured?: string;
  search?: string;
} 
