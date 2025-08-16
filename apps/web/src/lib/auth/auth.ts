/**
 * Authentication utilities for handling user sessions and tokens
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_STORAGE_KEY = 'user_data';

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

/**
 * Save authentication tokens and user data to local storage
 */
export const saveAuthData = (tokens: AuthTokens, user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

/**
 * Get the authentication token
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Get the refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Get the current user from local storage
 */
export const getCurrentUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Check if the current user has any of the specified roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const user = getCurrentUser();
  return roles.includes(user?.role);
};

/**
 * Get the current user's role
 */
export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
};

/**
 * Check if the current route requires authentication
 */
export const isAuthRequired = (pathname: string): boolean => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth/[...nextauth]',
  ];
  
  return !publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};

/**
 * Parse JWT token
 */
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

// Export all auth utilities as a single object for easier imports
export const authUtils = {
  saveAuthData,
  getToken,
  getRefreshToken,
  getCurrentUser,
  isAuthenticated,
  clearAuthData,
  hasRole,
  hasAnyRole,
  getUserRole,
  hasPermission,
  isAuthRequired,
  parseJwt,
  isTokenExpired,
  getTokenExpiration,
};
