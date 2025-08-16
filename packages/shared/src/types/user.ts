export type Role = 
  | 'ADMIN' 
  | 'ASSET_MANAGER' 
  | 'TECHNICIAN' 
  | 'CLIENT' 
  | 'GUEST' 
  | 'MAINTENANCE' 
  | 'SUPERVISOR' 
  | 'ENGINEER' 
  | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: Role;
  avatarUrl?: string;
}

export interface UserProfile extends Omit<User, 'password' | 'refreshToken'> {
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastPasswordChange?: string;
  failedLoginAttempts?: number;
  accountLockedUntil?: string | null;
}

export interface PasswordResetData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
}
