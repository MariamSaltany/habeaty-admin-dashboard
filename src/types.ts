// src/types.ts
import type { User, AuthData, AuthContextType } from "./types/auth";

export type { User, AuthData, AuthContextType };

export interface Media {
  id: number;
  file_path: string;
  file_name: string;
  mime_type: string;
  size: number;
  collection: string;
  url?: string;
  data?: string;
}

export interface Author extends User {
  first_name: string;
  last_name: string;
  photo?: Media;
  status: string;
  author_details?: {
    bio?: string;
    country?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  order_column: number;
  parent_id: number | null;
  children?: Category[];
  is_root: boolean;
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  isbn: string;
  price: { amount: number; formatted: string; };
  publish_year: number;
  stock: number;
  stock_level: number;
  category_id: number;
  category?: Category;
  owner_id?: number;
  owner?: User;
  authors: User[];
  cover?: Media | null;
  status: { label: string; value: string; };
}

export interface PaginatedData<T> {
  data: T[];
  meta: { 
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}