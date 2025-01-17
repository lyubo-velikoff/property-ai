export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PaginationState<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  cachedData: Record<number, T[]>;
}

export interface UsePaginationOptions<T> {
  pageSize?: number;
  fetchData: (page: number, pageSize: number) => Promise<{ data: T[]; totalPages: number }>;
}

export interface UsePaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  goToPage: (page: number) => void;
} 
