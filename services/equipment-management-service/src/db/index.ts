import { drizzle } from 'drizzle-orm/better-sqlite3';
// @ts-ignore - types for better-sqlite3 may not be present in this environment
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env' });

const dbPath = process.env.DATABASE_URL || './dev.db';
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set for Equipment Management Service. Using default ./dev.db');
}

// In a real monorepo, both services might connect to the same database
// or different ones. For this project, we'll assume they might be separate
// and each will have its own database file.
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
