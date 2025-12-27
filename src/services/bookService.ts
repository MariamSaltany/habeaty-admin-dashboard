// kotobi-admin-dashboard-web/src/services/bookService.ts
import axiosClient from '../api/axiosClient';
import type { ApiResponse, PaginatedData, Book } from '../types';

export interface BookFilters {
  page?: number;
  per_page?: number;
  title?: string;
  isbn?: string;
  category_id?: number;
  is_active?: boolean;
  sort?: string;
}

export const bookService = {
  getAll: async (filters: BookFilters = {}): Promise<ApiResponse<PaginatedData<Book>>> => {
    const params: any = {
      page: filters.page,
      per_page: filters.per_page,
      sort: filters.sort,
      'filter[title]': filters.title,
      'filter[isbn]': filters.isbn,
      'filter[category_id]': filters.category_id,
      'filter[is_active]': filters.is_active,
    };
    const response = await axiosClient.get<ApiResponse<PaginatedData<Book>>>('/admin/books', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Book>> => {
    const response = await axiosClient.get<ApiResponse<Book>>(`/admin/books/${slug}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<Book>> => {
    const response = await axiosClient.post<ApiResponse<Book>>('/admin/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (slug: string, formData: FormData): Promise<ApiResponse<Book>> => {

    const response = await axiosClient.post<ApiResponse<Book>>(`/admin/books/${slug}`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
    return response.data;
  },

  delete: async (slug: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/admin/books/${slug}`);
    return response.data;
  }
};