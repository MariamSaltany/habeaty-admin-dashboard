// kotobi-admin-dashboard-web/src/services/authService.ts
import axiosClient from '../api/axiosClient';
import type { ApiResponse, AuthData } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthData>> => {
    const response = await axiosClient.post<ApiResponse<AuthData>>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  }
};