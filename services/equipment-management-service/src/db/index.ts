import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set for Equipment Management Service');
}

// In a real monorepo, both services might connect to the same database
// or different ones. For this project, we'll assume they might be separate
// and each will have its own database file.
const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
