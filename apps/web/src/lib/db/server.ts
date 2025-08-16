import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

const DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'ems.db');

// Get database instance for server-side API routes
export const getServerDb = (): Database.Database => {
  if (db) return db;

  try {
    // Check if database file exists
    if (!fs.existsSync(DB_PATH)) {
      throw new Error(`Database file not found at ${DB_PATH}`);
    }
    
    db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');
    
    // Test the connection
    db.prepare('SELECT 1').get();
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.error('DB Path:', DB_PATH);
    console.error('DB exists:', fs.existsSync(DB_PATH));
    throw error;
  }
};

// Save database (no-op for better-sqlite3 as it auto-saves)
export const saveServerDb = (): void => {
  // better-sqlite3 automatically saves changes
};

// Close database connection
export const closeServerDb = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
