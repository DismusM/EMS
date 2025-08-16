import initSqlJs, { SqlJsStatic, Database } from 'sql.js';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { Asset, User, ActivityLog } from './schema';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

// Path to the SQLite database file
const DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'ems.db');

// Path to the WebAssembly file
const WASM_PATH = process.env.SQL_JS_WASM_PATH || 
  path.join(process.cwd(), 'public', 'sql-wasm', 'sql-wasm.wasm');

// Ensure the data directory exists
const ensureDataDirectory = async (filePath: string) => {
  const dir = path.dirname(filePath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

// Download the WebAssembly file if it doesn't exist
const ensureWasmFile = async () => {
  try {
    await fs.promises.access(WASM_PATH, fs.constants.F_OK);
    console.log('✅ WebAssembly file exists');
  } catch (error) {
    console.log('🌐 Downloading WebAssembly file...');
    const response = await fetch('https://sql.js.org/dist/sql-wasm.wasm');
    const wasmBuffer = await response.arrayBuffer();
    await ensureDataDirectory(WASM_PATH);
    await fs.promises.writeFile(WASM_PATH, Buffer.from(wasmBuffer));
    console.log('✅ WebAssembly file downloaded');
  }
};

// Create database tables
const createTables = async (db: Database) => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive', 'suspended')),
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      lastLogin INTEGER
    )
  `);

  // Create assets table
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT,
      serialNumber TEXT NOT NULL,
      location TEXT,
      status TEXT NOT NULL CHECK(status IN ('available', 'in_use', 'maintenance', 'retired')),
      purchaseDate INTEGER,
      department TEXT,
      building TEXT,
      room TEXT,
      custodianId TEXT,
      custodianName TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (custodianId) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create activity_log table
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      userId TEXT,
      action TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      details TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
};

// Initialize the database
export const initializeDb = async (): Promise<Database> => {
  if (db) return db;

  try {
    // Ensure WebAssembly file exists
    await ensureWasmFile();

    // Initialize SQL.js with the local WebAssembly file
    const wasmBinary = await fs.promises.readFile(WASM_PATH);
    
    SQL = await initSqlJs({
      // @ts-ignore - The type definition is missing the wasmBinary option
      wasmBinary,
      locateFile: () => WASM_PATH,
    });

    await ensureDataDirectory(DB_PATH);

    // Check if the database file exists
    let data: Uint8Array | undefined;
    try {
      const fileData = await readFile(DB_PATH);
      data = new Uint8Array(fileData);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading database file:', error);
        throw error;
      }
      console.log('No existing database found, creating a new one');
    }

    // Initialize the database
    db = new SQL.Database(data);

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;');

    // Create tables if they don't exist
    await createTables(db);

    console.log('✅ SQLite database initialized');
    return db;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Get the database instance
export const getDb = async (): Promise<Database> => {
  if (!db) {
    return await initializeDb();
  }
  return db;
};

// Save the database to disk
export const saveDb = async (): Promise<void> => {
  if (!db) return;
  
  try {
    await ensureDataDirectory(DB_PATH);
    const data = db.export();
    await writeFile(DB_PATH, new Uint8Array(data));
    console.log('💾 Database saved to disk');
  } catch (error) {
    console.error('❌ Error saving database to disk:', error);
    throw error;
  }
};

// Close the database connection
export const closeDb = async (): Promise<void> => {
  if (db) {
    await saveDb();
    db.close();
    db = null;
    SQL = null;
  }
};

// Handle process termination to save the database
process.on('exit', () => {
  if (db) {
    db.close();
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  if (db) {
    db.close();
  }
  process.exit(0);
});

// Export types and schema
import * as schema from './schema';
export { schema };
export * from './schema';

export default {
  getDb,
  saveDb,
  closeDb,
  initializeDb,
  schema
};
