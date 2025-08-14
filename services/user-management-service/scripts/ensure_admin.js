// Ensure roles and default admin exist in SQLite dev DB
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);

// bcrypt hash for password 'admin'
const ADMIN_HASH = '$2a$10$7bS.ih.pC2hedUrycQ9s9.M6nDT./v26fV0yvQd1d2s.J5.j.xYwS';

const roles = [
  ['admin', 'Admin'],
  ['supervisor', 'Supervisor'],
  ['technician', 'Technician'],
  ['asset_manager', 'Asset Manager'],
  ['client', 'Client'],
];

try {
  db.exec('BEGIN');
  db.prepare('CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role_id TEXT NOT NULL, created_at INTEGER DEFAULT (strftime(\'%s\', \"now\")) NOT NULL, updated_at INTEGER DEFAULT (strftime(\'%s\', \"now\")) NOT NULL, FOREIGN KEY(role_id) REFERENCES roles(id));').run();

  const insertRole = db.prepare('INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)');
  for (const [id, name] of roles) insertRole.run(id, name);

  const adminId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  db.prepare('INSERT OR IGNORE INTO users (id, name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)')
    .run(adminId, 'Default Admin', 'admin@example.com', ADMIN_HASH, 'admin');

  db.exec('COMMIT');
  const row = db.prepare('SELECT email, role_id as roleId FROM users WHERE email = ?').get('admin@example.com');
  console.log('Ensured admin exists:', row);
} catch (e) {
  db.exec('ROLLBACK');
  console.error('Failed to ensure admin:', e);
  process.exit(1);
} finally {
  db.close();
}
