/**
 * Authentication utilities for handling user sessions and tokens
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_STORAGE_KEY = 'user_data';

/**
 * Save authentication tokens to local storage
 */
export const saveAuthData = (token: string, refreshToken: string, user?: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
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
export const getCurrentUser = (): any => {
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
 * This would be implemented based on your permission system
 */
export const hasPermission = (permission: string): boolean => {
  // Implement permission checking logic here
  // This is a placeholder implementation
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
};

/**
 * Refresh the authentication token
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    // This would call your refresh token endpoint
    // const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    // saveAuthData(response.token, response.refreshToken, response.user);
    // return true;
    return false; // Placeholder
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Check if the current route requires authentication
 */
export const isAuthRequired = (pathname: string): boolean => {
  // List of routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  return !publicRoutes.some(route => pathname.startsWith(route));
};
