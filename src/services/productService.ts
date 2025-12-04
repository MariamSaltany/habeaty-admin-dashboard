import axiosClient from '../api/axiosClient';
import type { Product, ProductResponse } from '../types';

export const getProducts = async (limit = 20, skip = 0): Promise<ProductResponse> => {
  const response = await axiosClient.get<ProductResponse>(`/products?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axiosClient.post<Product>('/products/add', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await axiosClient.put<Product>(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await axiosClient.delete<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<ProductResponse> => {
  const response = await axiosClient.get<ProductResponse>(`/products/search?q=${query}`);
  return response.data;
};