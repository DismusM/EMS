import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Role } from '@ems/shared/types/user';
import { 
  getToken, 
  getCurrentUser, 
  clearAuthData as clearStoredAuthData,
  saveAuthData as saveStoredAuthData,
  isTokenExpired,
  getRefreshToken
} from './auth';
import { userService } from '@/lib/services/api/users';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  hasRole: (role: Role | Role[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          if (isTokenExpired(token)) {
            // Attempt to refresh token if expired
            await handleTokenRefresh();
          } else {
            // Get user from storage or fetch from server
            const storedUser = getCurrentUser();
            if (storedUser) {
              setUser(storedUser);
              // Optionally refresh user data from server
              await refreshUser();
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid auth data
        clearStoredAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleTokenRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;
      
      // Call your refresh token endpoint
      // const { token, refreshToken: newRefreshToken, user } = await authService.refreshToken(refreshToken);
      // saveStoredAuthData({ token, refreshToken: newRefreshToken }, user);
      // setUser(user);
      // return true;
      return false; // Placeholder
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token, refreshToken } = await userService.login(email, password);
      saveStoredAuthData({ token, refreshToken }, user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    try {
      setLoading(true);
      const user = await userService.register(data);
      // Optionally log in the user after registration
      // const { token, refreshToken } = await userService.login(data.email, data.password);
      // saveStoredAuthData({ token, refreshToken }, user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuthData();
    setUser(null);
    // Redirect to login or home page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await userService.getCurrentUser();
      setUser(user);
      // Update stored user data
      const token = getToken();
      const refreshToken = getRefreshToken();
      if (token && refreshToken) {
        saveStoredAuthData({ token, refreshToken }, user);
      }
      return user;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(user.id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const hasRole = useCallback((role: Role | Role[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
