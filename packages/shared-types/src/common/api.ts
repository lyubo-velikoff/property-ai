/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Common error codes
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
} 
