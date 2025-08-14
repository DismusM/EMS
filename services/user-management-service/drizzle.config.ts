import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const url = process.env.DATABASE_URL || './dev.db';
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Using default ./dev.db for user service migrations.');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url,
  },
  verbose: true,
  strict: true,
};
