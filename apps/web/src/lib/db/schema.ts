// Database schema types and interfaces

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: number;
  updatedAt: number;
  lastLogin?: number;
}

export interface NewUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Asset related types
export interface Asset {
  id: string;
  name: string;
  model?: string;
  serialNumber: string;
  location?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  purchaseDate?: number;
  department?: string;
  building?: string;
  room?: string;
  custodianId?: string;
  custodianName?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NewAsset extends Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Activity log related types
export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  createdAt: number;
}

export interface NewActivityLog extends Omit<ActivityLog, 'id' | 'createdAt'> {
  id?: string;
  createdAt?: number;
}

// Schema for type safety
// This is a lightweight alternative to Drizzle's schema definition
// that works with raw SQL queries

export const schema = {
  users: {
    tableName: 'users',
    columns: [
      'id', 'name', 'email', 'passwordHash', 'role', 'status', 
      'createdAt', 'updatedAt', 'lastLogin'
    ] as const,
  },
  assets: {
    tableName: 'assets',
    columns: [
      'id', 'name', 'model', 'serialNumber', 'location', 'status',
      'purchaseDate', 'department', 'building', 'room', 'custodianId',
      'custodianName', 'createdAt', 'updatedAt'
    ] as const,
  },
  activityLog: {
    tableName: 'activity_log',
    columns: [
      'id', 'userId', 'action', 'entityType', 'entityId', 'details', 'createdAt'
    ] as const,
  },
} as const;

// Helper types for type safety
export type UserColumn = typeof schema.users.columns[number];
export type AssetColumn = typeof schema.assets.columns[number];
export type ActivityLogColumn = typeof schema.activityLog.columns[number];

// Helper functions for building queries
export function selectAll(table: keyof typeof schema) {
  return `SELECT * FROM ${schema[table].tableName}`;
}

export function selectById(table: keyof typeof schema, id: string) {
  return `SELECT * FROM ${schema[table].tableName} WHERE id = '${id}'`;
}

export function insert(table: keyof typeof schema, data: Record<string, any>) {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data)
    .map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v)
    .join(', ');
  return `INSERT INTO ${schema[table].tableName} (${columns}) VALUES (${values})`;
}

export function update(table: keyof typeof schema, id: string, data: Record<string, any>) {
  const updates = Object.entries(data)
    .map(([k, v]) => {
      const value = typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v;
      return `${k} = ${value}`;
    })
    .join(', ');
  return `UPDATE ${schema[table].tableName} SET ${updates} WHERE id = '${id}'`;
}

export function remove(table: keyof typeof schema, id: string) {
  return `DELETE FROM ${schema[table].tableName} WHERE id = '${id}'`;
}
