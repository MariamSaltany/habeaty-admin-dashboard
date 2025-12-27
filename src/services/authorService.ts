// kotobi-admin-dashboard-web/src/services/authorService.ts
import axiosClient from '../api/axiosClient';
import type { ApiResponse, PaginatedData, Author } from '../types';

export const authorService = {
  list: async (search?: string): Promise<ApiResponse<PaginatedData<Author>>> => {
    const params = search ? { search } : {};
    const response = await axiosClient.get('/admin/authors', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Author>> => {
    const response = await axiosClient.get(`/admin/authors/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<Author>> => {
    const response = await axiosClient.post('/admin/authors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<ApiResponse<Author>> => {
    const response = await axiosClient.put(`/admin/authors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete(`/admin/authors/${id}`);
    return response.data;
  },

  approve: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.patch(`/admin/authors/${id}/approve`);
    return response.data;
  },

  block: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.patch(`/admin/authors/${id}/block`);
    return response.data;
  }
};