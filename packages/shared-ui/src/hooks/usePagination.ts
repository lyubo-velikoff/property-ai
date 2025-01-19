import { useState, useCallback } from "react";
import type {
  PaginationState,
  UsePaginationOptions,
  UsePaginationResult
} from "../types";

export function usePagination<T>({
  pageSize = 9,
  initialPage = 1,
  onPageChange,
  cacheSize = 5,
  fetchData
}: UsePaginationOptions<T> = {}): UsePaginationResult<T> {
  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    currentPage: initialPage,
    totalPages: 1,
    pageSize,
    cachedData: {}
  });

  const setTotalPages = useCallback((pages: number) => {
    setState((prev) => ({
      ...prev,
      totalPages: pages
    }));
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > state.totalPages) return;
      setState((prev) => ({
        ...prev,
        currentPage: page
      }));
      onPageChange?.(page);
    },
    [state.totalPages, onPageChange]
  );

  const setCachedData = useCallback(
    (page: number, data: T[]) => {
      setState((prev) => {
        const entries = Object.entries(prev.cachedData);
        if (entries.length >= cacheSize) {
          // Remove oldest entries if cache is full
          const sortedEntries = entries
            .sort(
              (a, b) =>
                Math.abs(prev.currentPage - Number(b[0])) -
                Math.abs(prev.currentPage - Number(a[0]))
            )
            .slice(0, cacheSize - 1);
          return {
            ...prev,
            cachedData: {
              ...Object.fromEntries(sortedEntries),
              [page]: data
            }
          };
        }
        return {
          ...prev,
          cachedData: {
            ...prev.cachedData,
            [page]: data
          }
        };
      });
    },
    [cacheSize]
  );

  const getCachedData = useCallback(
    (page: number) => {
      return state.cachedData[page];
    },
    [state.cachedData]
  );

  const clearCache = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cachedData: {}
    }));
  }, []);

  const goToPage = useCallback(
    async (page: number) => {
      if (!fetchData || page < 1 || page > state.totalPages) return;

      // Check cache first
      const cachedData = state.cachedData[page];
      if (cachedData) {
        setState((prev) => ({
          ...prev,
          currentPage: page,
          data: cachedData
        }));
        return;
      }

      try {
        const { data, totalPages } = await fetchData(page, pageSize);
        setState((prev) => ({
          ...prev,
          currentPage: page,
          totalPages,
          data,
          cachedData: {
            ...prev.cachedData,
            [page]: data
          }
        }));
      } catch (error) {
        throw error;
      }
    },
    [state.totalPages, state.cachedData, pageSize, fetchData]
  );

  return {
    data: state.data,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    pageSize: state.pageSize,
    setTotalPages,
    handlePageChange,
    setCachedData,
    getCachedData,
    clearCache,
    goToPage
  };
}
