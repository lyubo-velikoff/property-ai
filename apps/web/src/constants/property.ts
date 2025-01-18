export const constructionTypes = [
  { value: 'BRICK', label: 'Тухла' },
  { value: 'PANEL', label: 'Панел' },
  { value: 'EPK', label: 'ЕПК' },
  { value: 'CONCRETE', label: 'Бетон' },
  { value: 'STEEL', label: 'Метал' },
  { value: 'WOOD', label: 'Дървена' },
] as const;

export const furnishingTypes = [
  { value: 'FULLY_FURNISHED', label: 'Обзаведен' },
  { value: 'SEMI_FURNISHED', label: 'Частично обзаведен' },
  { value: 'UNFURNISHED', label: 'Необзаведен' },
] as const;

export const propertyTypes = [
  { value: 'APARTMENT', label: 'Апартамент' },
  { value: 'HOUSE', label: 'Къща' },
  { value: 'PLOT', label: 'Парцел' },
  { value: 'COMMERCIAL', label: 'Магазин' },
  { value: 'INDUSTRIAL', label: 'Склад' },
] as const;

export const locationTypes = [
  { value: 'CITY', label: 'Град' },
  { value: 'SUBURB', label: 'Квартал' },
  { value: 'VILLAGE', label: 'Село' },
  { value: 'SEASIDE', label: 'Море' },
  { value: 'MOUNTAIN', label: 'Планина' },
] as const;

export const categories = [
  { value: 'SALE', label: 'Продажба' },
  { value: 'RENT', label: 'Наем' },
] as const;

export const currencies = [
  { value: 'BGN', label: 'лв.' },
  { value: 'EUR', label: '€' },
  { value: 'USD', label: '$' },
] as const;

// Label mappings for direct access
export const propertyTypeLabels: Record<string, string> = Object.fromEntries(
  propertyTypes.map(type => [type.value, type.label])
);

export const locationTypeLabels: Record<string, string> = Object.fromEntries(
  locationTypes.map(type => [type.value, type.label])
);

export const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map(category => [category.value, category.label])
);

export const constructionTypeLabels: Record<string, string> = Object.fromEntries(
  constructionTypes.map(type => [type.value, type.label])
);

export const furnishingTypeLabels: Record<string, string> = Object.fromEntries(
  furnishingTypes.map(type => [type.value, type.label])
);

export const currencyLabels: Record<string, string> = Object.fromEntries(
  currencies.map(currency => [currency.value, currency.label])
); 
