'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@ems/shared';
import { getCurrentUserProfile, refreshAccessToken, logout as apiLogout } from '@ems/user-management';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const AuthContext = createContext<{
  authState: AuthState;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}>({
  authState: initialState,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { accessToken } = await refreshAccessToken();
        if (accessToken) {
          const userProfile = await getCurrentUserProfile(accessToken);
          setAuthState({ isAuthenticated: true, user: userProfile, token: accessToken });
        }
      } catch (error) {
        console.log('No active session found.');
        setAuthState(initialState);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: User) => {
    setAuthState({
      isAuthenticated: true,
      token,
      user,
    });
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Failed to logout from server:', error);
    } finally {
      setAuthState(initialState);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
