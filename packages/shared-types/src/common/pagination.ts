/**
 * Common pagination parameters for requests
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Common pagination metadata for responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Base interface for paginated responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
} 
