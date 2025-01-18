import { z } from 'zod';
import { PropertyType, PropertyCategory, LocationType, Currency, ConstructionType, FurnishingType } from '@avalon/shared-types';

export const propertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  currency: z.enum(['BGN', 'EUR', 'USD'] as const) satisfies z.ZodType<Currency>,
  area_sqm: z.coerce.number().min(0),
  land_area_sqm: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  total_floors: z.coerce.number().optional(),
  construction_type: z.enum(['BRICK', 'PANEL', 'EPK', 'CONCRETE', 'STEEL', 'WOOD'] as const) satisfies z.ZodType<ConstructionType>,
  furnishing: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'] as const) satisfies z.ZodType<FurnishingType>,
  location_type: z.enum(['CITY', 'SUBURB', 'VILLAGE', 'SEASIDE', 'MOUNTAIN'] as const) satisfies z.ZodType<LocationType>,
  regionId: z.coerce.number().optional(),
  neighborhoodId: z.coerce.number().optional(),
  has_regulation: z.boolean().optional(),
  category: z.enum(['SALE', 'RENT'] as const) satisfies z.ZodType<PropertyCategory>,
  type: z.enum(['APARTMENT', 'HOUSE', 'PLOT', 'COMMERCIAL', 'INDUSTRIAL'] as const) satisfies z.ZodType<PropertyType>,
  featured: z.boolean().default(false),
  contact_info: z.object({
    phone: z.string().min(1),
    email: z.string().email(),
  }).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const createPropertySchema = propertySchema;

export const updatePropertySchema = propertySchema.partial();

export const propertySearchSchema = z.object({
  category: z.enum(['SALE', 'RENT'] as const) satisfies z.ZodType<PropertyCategory>,
  type: z.enum(['APARTMENT', 'HOUSE', 'PLOT', 'COMMERCIAL', 'INDUSTRIAL'] as const) satisfies z.ZodType<PropertyType>,
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  location: z.string().optional(),
  currency: z.enum(['BGN', 'EUR', 'USD'] as const) satisfies z.ZodType<Currency>,
}).partial();

export type PropertySearchParams = z.infer<typeof propertySearchSchema>;

export const propertyResponseSchema = propertySchema.extend({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
  })),
  contact_info: z.object({
    id: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
});

export type PropertyResponse = z.infer<typeof propertyResponseSchema>; 
