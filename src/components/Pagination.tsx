// kotobi-admin-dashboard-web/src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { categoryService, type CategoryFilters } from '../services/categoryService';
import { useState, useMemo } from 'react';

export const useCategories = () => {
  const [params, setParams] = useState<CategoryFilters>({
    page: 1,
    per_page: 50,
    sort: 'order_column'
  });

  const query = useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getAll(params)
  });

  const updateParams = (newParams: Partial<CategoryFilters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Fixed selector to access the nested data array inside ApiResponse<PaginatedData<Category>>
  const categories = useMemo(() => query.data?.data.data || [], [query.data]);

  return {
    categories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    params,
    updateParams,
    refetch: query.refetch
  };
};

export const useSubcategories = (parentId: number | null) => {
  const query = useQuery({
    queryKey: ['subcategories', parentId],
    queryFn: () => categoryService.getSubcategories(parentId!),
    enabled: !!parentId
  });

  // Fixed selector to access the data property from ApiResponse<Category[]>
  const subcategories = useMemo(() => query.data?.data || [], [query.data]);

  return {
    subcategories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
