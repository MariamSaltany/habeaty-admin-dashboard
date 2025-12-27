// kotobi-admin-dashboard-web/src/types/auth.ts
export interface User {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  username: string;
  type: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading?: boolean;
}