export interface Role {
  id: RoleId;
  name: string;
}

export type RoleId = 'admin' | 'supervisor' | 'technician' | 'asset_manager' | 'client';

export const ROLE_IDS: Record<Uppercase<RoleId>, RoleId> = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  TECHNICIAN: 'technician',
  ASSET_MANAGER: 'asset_manager',
  CLIENT: 'client',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  model?: string;
  serialNumber: string;
  location?: string;
  status: 'OPERATIONAL' | 'IN_REPAIR' | 'DECOMMISSIONED';
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// This could be expanded with more auth-related types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
