import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schemaExports from './schema';
const schema = { ...schemaExports };
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Beginner note: This is a temporary script to help us debug.
// It connects to the database and prints out all the users it finds.

const dbPath = process.env.DATABASE_URL || './dev.db';
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function showUsers() {
  console.log('🔍 Querying all users from the database...');

  try {
    const allUsers = await db.query.users.findMany({
        with: {
            role: true,
        }
    });

    if (allUsers.length === 0) {
        console.log('No users found in the database.');
    } else {
        console.log('--- Users in Database ---');
                console.table(allUsers.map((u: any) => ({ id: u.id, name: u.name, email: u.email, status: u.status, role: u.role?.name })))
        console.log('-------------------------');
    }

  } catch (error) {
    console.error('❌ Error querying users:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

showUsers();
