import { apiClient } from './base';
import { 
  User, 
  Role, 
  UserFilters, 
  PaginatedResponse,
  UpdateUserData,
  ChangePasswordData,
  ResetPasswordData
} from '@ems/shared/types/user';

export const userService = {
  // User CRUD operations
  async getUsers(
    filters?: UserFilters, 
    page = 1, 
    limit = 10
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.department && { department: filters.department }),
    });

    return apiClient.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'avatarUrl'>): Promise<User> {
    return apiClient.post<User>('/users', userData);
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, userData);
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    return apiClient.post<{ user: User; token: string; refreshToken: string }>('/auth/login', { email, password });
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    return apiClient.post<User>('/auth/register', userData);
  },

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh-token', { refreshToken });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', data);
  },

  // User Profile
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/profile`, data);
  },

  async changePassword(userId: string, data: ChangePasswordData): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`/users/${userId}/change-password`, data);
  },

  // Avatar Management
  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post<{ avatarUrl: string }>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  async deleteAvatar(userId: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/avatar`);
  },

  // User Roles and Permissions
  async getRoles(): Promise<Role[]> {
    return apiClient.get<Role[]>('/users/roles');
  },

  async updateUserRole(userId: string, role: Role): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/role`, { role });
  },

  // User Status Management
  async deactivateUser(userId: string): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/deactivate`);
  },

  async activateUser(userId: string): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/activate`);
  },

  // User Sessions
  async getUserSessions(userId: string): Promise<Array<{
    id: string;
    ip: string;
    userAgent: string;
    lastUsed: string;
    current: boolean;
  }>> {
    return apiClient.get(`/users/${userId}/sessions`);
  },

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/sessions/${sessionId}`);
  },

  async revokeAllSessions(userId: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/sessions`);
  },
};
