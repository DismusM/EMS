'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@ems/shared';
import { getCurrentUserProfile } from '@ems/user-management/src/api/apiClient';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const AuthContext = createContext<{
  authState: AuthState;
  login: (token: string) => void;
  logout: () => void;
}>({
  authState: initialState,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for a token in local storage on initial load
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
        const userProfile = await getCurrentUserProfile(token);
        setAuthState({ isAuthenticated: true, user: userProfile, token });
    } catch (error) {
        console.error("Failed to fetch profile, logging out.", error);
        logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    fetchProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
