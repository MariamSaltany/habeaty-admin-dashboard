import React, { createContext, useState } from 'react';
import type { User, AuthContextType } from '../types';
import type { ReactNode} from 'react';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // FIX: Initialize state SYNCHRONOUSLY from localStorage.
  // This prevents the "flash" of unauthenticated state on page refresh.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation
        if (parsedUser && parsedUser.token) {
          return parsedUser;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing auth storage:", error);
      // Clean up corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  // Since we check localStorage synchronously above, the loading state is always false initially.
  // We remove 'setIsLoading' because it is never used, fixing the TypeScript warning.
  const [isLoading] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Note: We rely on ProtectedRoute to detect user === null and redirect to /login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};