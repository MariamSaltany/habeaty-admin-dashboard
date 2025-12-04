import axios from 'axios';
import type { LoginResponse } from '../types';

// Using direct axios here to avoid the interceptor loop during login
const API_URL = 'https://dummyjson.com/auth';

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
    username,
    password,
  });
  return response.data;
};