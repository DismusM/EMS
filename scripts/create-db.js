const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'ems.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ASSET_MANAGER', 'TECHNICIAN', 'CLIENT', 'SUPERVISOR')),
    status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'suspended')),
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    lastLogin INTEGER
  );

  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    model TEXT,
    serialNumber TEXT UNIQUE NOT NULL,
    location TEXT,
    status TEXT NOT NULL CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    purchaseDate INTEGER,
    department TEXT,
    building TEXT,
    room TEXT,
    custodianId TEXT,
    custodianName TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (custodianId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    userId TEXT,
    action TEXT NOT NULL,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    details TEXT,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Insert sample data
const now = Date.now();

// Insert users
db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, passwordHash, role, status, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('admin', 'Admin User', 'admin@example.com', '', 'ADMIN', 'active', now, now);

db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, passwordHash, role, status, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('user1', 'Regular User', 'user@example.com', '', 'TECHNICIAN', 'active', now, now);

// Insert assets
db.prepare(`
  INSERT OR REPLACE INTO assets (id, name, model, serialNumber, location, status, department, building, room, custodianId, custodianName, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run('asset1', 'Laptop Dell XPS 15', 'XPS 15 9500', 'DLXPS159500001', 'IT Department', 'in_use', 'IT', 'Main', '101', 'admin', 'Admin User', now, now);

db.prepare(`
  INSERT OR REPLACE INTO assets (id, name, model, serialNumber, location, status, department, building, room, custodianId, custodianName, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run('asset2', 'Monitor Dell UltraSharp 27"', 'U2720Q', 'DLU2720Q001', 'IT Department', 'available', 'IT', 'Main', '101', null, null, now, now);

// Insert activity logs
db.prepare(`
  INSERT OR REPLACE INTO activity_log (id, userId, action, entityType, entityId, details, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run('log1', 'admin', 'create', 'user', 'admin', 'System: Initial admin user created', now);

db.prepare(`
  INSERT OR REPLACE INTO activity_log (id, userId, action, entityType, entityId, details, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run('log2', 'admin', 'create', 'asset', 'asset1', 'Asset Laptop Dell XPS 15 created', now);

db.close();

console.log('✅ Database created and seeded successfully at:', DB_PATH);
