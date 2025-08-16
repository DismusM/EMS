#!/usr/bin/env node
import { initializeDb, saveDb } from '../apps/web/src/lib/db';
import { seedDatabase } from '../apps/web/src/lib/db/seed';

async function main() {
  try {
    console.log('🌱 Starting database initialization...');
    
    // Initialize the database
    const db = await initializeDb();
    console.log('✅ Database connection established');
    
    // Run the seed function
    await seedDatabase();
    
    // Save changes to disk
    await saveDb();
    
    console.log('✅ Database initialized and seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

main();
