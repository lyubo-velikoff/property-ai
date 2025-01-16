// Common exports
export * from './common/api';
export * from './common/pagination';

// Location exports
export type {
  Region,
  Neighborhood,
  Location,
  Feature,
  CreateLocationInput,
  CreateFeatureInput,
  RegionResponse,
  RegionsResponse,
  NeighborhoodResponse,
  NeighborhoodsResponse,
  FeatureResponse,
  FeaturesResponse
} from './location';
export { FeatureType } from './location';

// Property exports
export * from './property/enums';
export type {
  ContactInfo,
  Image,
  Property,
  CreatePropertyInput,
  UpdatePropertyInput
} from './property/base';
export type { GetPropertiesParams } from './property/requests';
export type { PropertyResponse, PropertiesResponse } from './property/responses';

// Contact exports
export * from './contact';

// User exports
export { UserRole } from './user';
export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  UsersResponse
} from './user';

// Admin exports
export * from './admin';

// Auth exports
export type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  MeResponse
} from './auth'; 
