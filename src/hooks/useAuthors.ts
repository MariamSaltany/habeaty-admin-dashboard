
import { useQuery } from '@tanstack/react-query';
import { authorService } from '../services/authorService';
import { useState, useMemo } from 'react';

export const useAuthors = () => {
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['authors', search],
    queryFn: () => authorService.list(search),
  });

  // Fixed selectors to access the nested data array and meta object inside ApiResponse<PaginatedData<User>>
  const authors = useMemo(() => query.data?.data.data || [], [query.data]);
  const pagination = useMemo(() => query.data?.data.meta || { current_page: 1, last_page: 1, total: 0 }, [query.data]);

  return {
    authors,
    pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    search,
    setSearch,
    refetch: query.refetch
  };
};
