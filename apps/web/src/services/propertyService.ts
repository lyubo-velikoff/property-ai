import type {
  Property,
  PropertyResponse,
  PropertiesResponse,
  GetPropertiesParams,
  PropertyType,
  PropertyCategory,
  LocationType,
  Currency
} from "@avalon/shared-types";

const API_URL = import.meta.env.VITE_API_URL;

export type {
  Property,
  PropertyResponse,
  PropertiesResponse,
  GetPropertiesParams,
  PropertyType,
  PropertyCategory,
  LocationType,
  Currency
};

export async function getProperties(
  filters: GetPropertiesParams = {},
  page = 1,
  pageSize = 9
): Promise<PropertiesResponse> {
  const params = new URLSearchParams();

  // Add filters to query params
  if (filters.type) params.append("type", filters.type);
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.min_area) params.append("min_area", filters.min_area);
  if (filters.max_area) params.append("max_area", filters.max_area);
  if (filters.category) params.append("category", filters.category);
  if (filters.location_type)
    params.append("location_type", filters.location_type);
  if (filters.construction_type)
    params.append("construction_type", filters.construction_type);
  if (filters.furnishing) params.append("furnishing", filters.furnishing);
  if (filters.featured) params.append("featured", filters.featured.toString());
  if (filters.search) params.append("search", filters.search);

  // Add pagination params
  params.append("page", page.toString());
  params.append("limit", pageSize.toString());

  const response = await fetch(`${API_URL}/properties?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  const data = await response.json();
  return data.data;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const response = await fetch(`${API_URL}/properties/featured`);
  if (!response.ok) {
    throw new Error("Failed to fetch featured properties");
  }
  const data = await response.json();
  return data.data.data;
}

export async function getPropertyById(id: string): Promise<Property> {
  if (!id) {
    throw new Error("Invalid property ID");
  }

  const response = await fetch(`${API_URL}/properties/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch property");
  }

  if (data.status === "error") {
    throw new Error(data.message);
  }

  if (!data.data?.property) {
    throw new Error("Property not found");
  }

  return data.data.property;
}

export async function deleteProperty(id: string): Promise<void> {
  if (!id) {
    throw new Error("Invalid property ID");
  }

  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete property");
  }
}
