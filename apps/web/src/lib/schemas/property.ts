import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  currency: z.string().default('BGN'),
  area_sqm: z.coerce.number().min(0),
  land_area_sqm: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  total_floors: z.coerce.number().optional(),
  construction_type: z.string().optional(),
  furnishing: z.string().optional(),
  location_type: z.string().default('CITY'),
  regionId: z.coerce.number().optional(),
  neighborhoodId: z.coerce.number().optional(),
  has_regulation: z.boolean().optional(),
  category: z.string().default('SALE'),
  type: z.string().default('APARTMENT'),
  featured: z.boolean().default(false),
  contact_info: z.object({
    phone: z.string().min(1),
    email: z.string().email(),
  }),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const createPropertySchema = propertySchema;

export const updatePropertySchema = propertySchema.partial();

export const propertySearchSchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  location: z.string().optional(),
  currency: z.string().optional(),
});

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
