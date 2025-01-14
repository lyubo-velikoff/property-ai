/**
 * Type of property
 */
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  OFFICE = 'OFFICE',
  SHOP = 'SHOP',
  WAREHOUSE = 'WAREHOUSE',
  LAND = 'LAND'
}

/**
 * Category of property listing
 */
export enum PropertyCategory {
  SALE = 'SALE',
  RENT = 'RENT'
}

/**
 * Type of location
 */
export enum LocationType {
  CITY = 'CITY',
  SUBURB = 'SUBURB',
  VILLAGE = 'VILLAGE',
  SEASIDE = 'SEASIDE',
  MOUNTAIN = 'MOUNTAIN'
}

/**
 * Supported currencies
 */
export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  BGN = 'BGN'
}

/**
 * Construction types
 */
export enum ConstructionType {
  BRICK = 'BRICK',
  PANEL = 'PANEL',
  EPK = 'EPK',
  CONCRETE = 'CONCRETE',
  STEEL = 'STEEL',
  WOOD = 'WOOD'
}

/**
 * Furnishing status
 */
export enum FurnishingType {
  UNFURNISHED = 'UNFURNISHED',
  SEMI_FURNISHED = 'SEMI_FURNISHED',
  FULLY_FURNISHED = 'FULLY_FURNISHED'
} 
