// kotobi-admin-dashboard-web/src/hooks/useBooks.ts
import { useQuery } from '@tanstack/react-query';
import { bookService, type BookFilters } from '../services/bookService';
import { useState, useMemo } from 'react';

export const useBooks = () => {
  const [params, setParams] = useState<BookFilters>({
    page: 1,
    per_page: 15,
    sort: '-created_at'
  });

  const query = useQuery({
    queryKey: ['books', params],
    queryFn: () => bookService.getAll(params),
  });

  const updateParams = (newParams: Partial<BookFilters>) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams };
      if (newParams.title !== undefined || newParams.isbn !== undefined || newParams.category_id !== undefined) {
        updated.page = 1;
      }
      return updated;
    });
  };

  // Fixed selectors to access the nested data array and meta object inside ApiResponse<PaginatedData<Book>>
  const books = useMemo(() => query.data?.data.data || [], [query.data]);
  const pagination = useMemo(() => query.data?.data.meta || { current_page: 1, last_page: 1, total: 0 }, [query.data]);

  return {
    books,
    pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    params,
    updateParams,
    refetch: query.refetch
  };
};
