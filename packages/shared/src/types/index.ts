export interface Role {
  id: string;
  name: string;
}

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
