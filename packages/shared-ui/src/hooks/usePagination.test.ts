import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageSize).toBe(9);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() => 
      usePagination({ initialPage: 2, pageSize: 20 })
    );
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(20);
  });

  it('updates total pages', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.setTotalPages(5);
    });
    
    expect(result.current.totalPages).toBe(5);
  });

  it('handles page changes within bounds', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() => 
      usePagination({ onPageChange })
    );
    
    act(() => {
      result.current.setTotalPages(3);
    });

    act(() => {
      result.current.handlePageChange(2);
    });
    
    expect(result.current.currentPage).toBe(2);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('prevents page changes outside bounds', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() => 
      usePagination({ onPageChange })
    );
    
    act(() => {
      result.current.setTotalPages(3);
      result.current.handlePageChange(0);
      result.current.handlePageChange(4);
    });
    
    expect(result.current.currentPage).toBe(1);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('caches and retrieves page data', () => {
    const { result } = renderHook(() => 
      usePagination<string>()
    );
    
    const pageOneData = ['item1', 'item2'];
    const pageTwoData = ['item3', 'item4'];
    
    act(() => {
      result.current.setCachedData(1, pageOneData);
      result.current.setCachedData(2, pageTwoData);
    });
    
    expect(result.current.getCachedData(1)).toEqual(pageOneData);
    expect(result.current.getCachedData(2)).toEqual(pageTwoData);
  });

  it('limits cache size and removes oldest entries', () => {
    const { result } = renderHook(() => 
      usePagination<string>({ cacheSize: 2 })
    );
    
    act(() => {
      result.current.setCachedData(1, ['page1']);
      result.current.setCachedData(2, ['page2']);
      result.current.setCachedData(3, ['page3']);
    });
    
    // Should keep the most recently added entries
    expect(result.current.getCachedData(2)).toBeDefined();
    expect(result.current.getCachedData(3)).toBeDefined();
    expect(result.current.getCachedData(1)).toBeUndefined();
  });

  it('clears cache', () => {
    const { result } = renderHook(() => 
      usePagination<string>()
    );
    
    act(() => {
      result.current.setCachedData(1, ['page1']);
      result.current.setCachedData(2, ['page2']);
      result.current.clearCache();
    });
    
    expect(result.current.getCachedData(1)).toBeUndefined();
    expect(result.current.getCachedData(2)).toBeUndefined();
  });
}); 
