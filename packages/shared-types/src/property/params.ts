export interface GetPropertiesParams {
  page?: string;
  limit?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
  type?: 'APARTMENT' | 'HOUSE' | 'VILLA' | 'OFFICE' | 'SHOP' | 'WAREHOUSE' | 'LAND';
  category?: 'SALE' | 'RENT';
  location_type?: 'CITY' | 'SUBURB' | 'VILLAGE' | 'SEASIDE' | 'MOUNTAIN';
  construction_type?: 'BRICK' | 'PANEL' | 'EPK' | 'CONCRETE' | 'STEEL' | 'WOOD';
  furnishing?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  featured?: string;
} 
