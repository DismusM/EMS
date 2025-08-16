'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@ems/shared';
import { login as apiLogin, logout as apiLogout, refreshAccessToken, getCurrentUserProfile } from '@ems/user-management';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Initialize auth state from localStorage and attempt token refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      
      if (storedToken) {
        try {
          // Try to refresh the token first
          const { accessToken } = await refreshAccessToken();
          localStorage.setItem('accessToken', accessToken);
          
          // Get current user profile
          const user = await getCurrentUserProfile(accessToken);
          
          // Transform backend user format to frontend format
          const transformedUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).roleId || (user as any).role?.id || user.role, // Handle different role formats
            avatarUrl: user.avatarUrl,
            permissions: user.permissions
          };
          
          setAuthState({
            user: transformedUser,
            token: accessToken,
            isLoading: false,
          });
        } catch (error) {
          // Token refresh failed, clear stored token
          localStorage.removeItem('accessToken');
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem('accessToken', token);
    
    // Transform backend user format to frontend format
    const transformedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleId || user.role?.id || user.role, // Handle different role formats
      avatarUrl: user.avatarUrl,
      permissions: user.permissions
    };
    
    setAuthState({
      user: transformedUser,
      token,
      isLoading: false,
    });
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const { accessToken } = await refreshAccessToken();
      localStorage.setItem('accessToken', accessToken);
      
      // Get updated user profile
      const user = await getCurrentUserProfile(accessToken);
      
      setAuthState(prev => ({
        ...prev,
        user,
        token: accessToken,
      }));
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
