#!/usr/bin/env node
import { db } from '../src/lib/db';
import { seedDatabase } from '../src/lib/db/seed';

async function main() {
  console.log('🌱 Starting database seeding...');
  await seedDatabase();
  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
