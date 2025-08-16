import { apiClient } from './client';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@ems/shared/types/user';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh-token', {
      refreshToken,
    });
    return response;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      // Call the logout endpoint to invalidate the token
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we still want to clear local storage
    } finally {
      // Clear local storage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response;
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/me', userData);
    return response;
  },

  /**
   * Change the current user's password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },
};
