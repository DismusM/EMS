import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function main() {
  console.log('Running equipment DB migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Equipment DB migrations completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Equipment migration failed:', err);
  process.exit(1);
});
