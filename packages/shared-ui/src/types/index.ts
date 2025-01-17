export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  buttonLabels?: {
    previous: string;
    next: string;
  };
  pageInfoText?: {
    page: string;
    of: string;
  };
  showPageInfo?: boolean;
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
  initialPage?: number;
  onPageChange?: (page: number) => void;
  cacheSize?: number;
  fetchData?: (page: number, pageSize: number) => Promise<{ data: T[]; totalPages: number }>;
}

export interface UsePaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setTotalPages: (pages: number) => void;
  handlePageChange: (page: number) => void;
  setCachedData: (page: number, data: T[]) => void;
  getCachedData: (page: number) => T[] | undefined;
  clearCache: () => void;
  goToPage: (page: number) => Promise<void>;
} 
