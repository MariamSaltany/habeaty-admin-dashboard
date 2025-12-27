// kotobi-admin-dashboard-web/src/services/categoryService.ts
import axiosClient from '../api/axiosClient';
import type { ApiResponse, PaginatedData, Category } from '../types';

export interface CategoryFilters {
  page?: number;
  per_page?: number;
  name?: string;     // Maps to filter[name]
  slug?: string;     // Maps to filter[slug]
  parent_id?: number;
  roots?: boolean;   // Maps to filter[roots]
  sort?: string;
  include?: string[];
}

export const categoryService = {

  getAll: async (filters: CategoryFilters = {}): Promise<ApiResponse<PaginatedData<Category>>> => {
    const params: any = {
      page: filters.page,
      per_page: filters.per_page,
      sort: filters.sort,
      'filter[name]': filters.name,
      'filter[slug]': filters.slug,
      'filter[parent_id]': filters.parent_id,
      'filter[roots]': filters.roots,
      include: filters.include?.join(','),
    };

    const response = await axiosClient.get<ApiResponse<PaginatedData<Category>>>('admin/categories', { params });
    return response.data;
  },

  getBySlug: async (slug: string, includes: string[] = []): Promise<ApiResponse<Category>> => {
    const params = includes.length > 0 ? { include: includes.join(',') } : {};
    const response = await axiosClient.get<ApiResponse<Category>>(`admin/categories/${slug}`, { params });
    return response.data;
  },

  create: async (data: { name: string; parent_id?: number | null }): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.post<ApiResponse<Category>>('admin/categories', data);
    return response.data;
  },

  update: async (slug: string, data: { name: string; parent_id?: number | null }): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.put<ApiResponse<Category>>(`admin/categories/${slug}`, data);
    return response.data;
  },

  delete: async (slug: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`admin/categories/${slug}`);
    return response.data;
  },

  getSubcategories: async (parentId: number): Promise<ApiResponse<Category[]>> => {
    const response = await axiosClient.get<ApiResponse<Category[]>>(`admin/categories/${parentId}/subcategories`);
    return response.data;
  }
};