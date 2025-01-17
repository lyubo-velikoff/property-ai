import { useState, useCallback } from 'react';
import type { PaginationState, UsePaginationOptions, UsePaginationResult } from '../types';

export function usePagination<T>({ pageSize = 10, fetchData }: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    currentPage: 1,
    totalPages: 1,
    pageSize,
    cachedData: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const goToPage = useCallback(async (page: number) => {
    if (page < 1 || page > state.totalPages) return;
    
    // Check cache first
    const cachedData = state.cachedData[page];
    if (cachedData) {
      setState(prev => ({
        ...prev,
        currentPage: page,
        data: cachedData
      }));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, totalPages } = await fetchData(page, pageSize);
      setState(prev => ({
        ...prev,
        currentPage: page,
        totalPages,
        data,
        cachedData: {
          ...prev.cachedData,
          [page]: data
        }
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  }, [state.totalPages, state.cachedData, pageSize, fetchData]);

  return {
    data: state.data,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    isLoading,
    error,
    goToPage
  };
} 
