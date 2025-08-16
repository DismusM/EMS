import { SQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

declare module '@/lib/db' {
  export const db: BetterSQLite3Database<typeof import('@/lib/db/schema')>;
  export * from '@/lib/db/schema';
  export * from 'drizzle-orm';
}

declare module '@/lib/db/schema' {
  import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
  
  export const assets: ReturnType<typeof sqliteTable>;
  export const users: ReturnType<typeof sqliteTable>;
  export const activityLog: ReturnType<typeof sqliteTable>;
  
  export interface Asset {
    id: string;
    name: string;
    model: string | null;
    serialNumber: string;
    location: string | null;
    status: string;
    purchaseDate: number | null;
    department: string | null;
    building: string | null;
    room: string | null;
    custodianId: string | null;
    custodianName: string | null;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    status: string;
    createdAt: number;
    updatedAt: number;
    lastLogin?: number;
  }
  
  export interface ActivityLog {
    id: string;
    userId: string | null;
    action: string;
    entityType: string;
    entityId: string;
    details: string | null;
    createdAt: number;
  }
}
