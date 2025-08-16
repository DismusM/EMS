import type { Role } from '../types/user';

export const ROLES = {
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  CLIENT: 'CLIENT',
  GUEST: 'GUEST',
  MAINTENANCE: 'MAINTENANCE',
  SUPERVISOR: 'SUPERVISOR',
  ENGINEER: 'ENGINEER',
  MANAGER: 'MANAGER'
} as const;

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.ADMIN]: 9,
  [ROLES.MANAGER]: 8,
  [ROLES.ASSET_MANAGER]: 7,
  [ROLES.ENGINEER]: 6,
  [ROLES.SUPERVISOR]: 5,
  [ROLES.MAINTENANCE]: 4,
  [ROLES.TECHNICIAN]: 3,
  [ROLES.CLIENT]: 2,
  [ROLES.GUEST]: 1
};

export const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const getRoleDisplayName = (role: Role): string => {
  return role
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
