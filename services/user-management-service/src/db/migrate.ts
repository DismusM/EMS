import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// This will run migrations on the database, skipping the ones already applied
async function main() {
  console.log('Running database migrations...');
  migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
