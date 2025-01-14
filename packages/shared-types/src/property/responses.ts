import { PaginatedResponse } from '../common/pagination';
import { Property } from './base';

/**
 * Response for a single property
 */
export interface PropertyResponse {
  property: Property;
}

/**
 * Response for multiple properties
 */
export interface PropertiesResponse extends PaginatedResponse<Property> {} 
