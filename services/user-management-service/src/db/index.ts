import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env' });

const dbPath = process.env.DATABASE_URL || './dev.db';
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Using default ./dev.db');
}
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
