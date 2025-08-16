import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env' });

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  roleId: string | null;
}

const dbPath = process.env.DATABASE_URL || './dev.db';

function main() {
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT id, name, email, password_hash as passwordHash, role_id as roleId FROM users').all() as UserRow[];
  console.log('Users:', rows);
  
  const admin = rows.find((r) => r.email === 'admin@example.com');
  if (!admin) {
    console.error('Admin user not found.');
    process.exit(2);
  }
  
  const ok = bcrypt.compareSync('admin', admin.passwordHash);
  console.log('Bcrypt compare("admin", storedHash) =', ok);
}

main();
