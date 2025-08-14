import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Beginner note: This script populates our database with sample data.
// It's useful for development so we don't start with an empty app.

const dbPath = process.env.DATABASE_URL || './dev.db';
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Hash password for the admin user
    const adminPassword = await bcrypt.hash('admin', 10);

    // 1. Seed Roles (if they don't exist)
    console.log('Seeding roles...');
    const existingRoles = await db.query.roles.findMany();
    if (existingRoles.length === 0) {
        await db.insert(schema.roles).values([
            { id: 'admin', name: 'Administrator' },
            { id: 'supervisor', name: 'Supervisor' },
            { id: 'technician', name: 'Technician' },
            { id: 'asset-manager', name: 'Asset Manager' },
            { id: 'client', name: 'Client' },
        ]);
    }

    // Get roles for user seeding
    const adminRole = await db.query.roles.findFirst({ where: eq(schema.roles.id, 'admin') });
    const techRole = await db.query.roles.findFirst({ where: eq(schema.roles.id, 'technician') });
    const clientRole = await db.query.roles.findFirst({ where: eq(schema.roles.id, 'client') });

    if (!adminRole || !techRole || !clientRole) throw new Error('Core roles not found!');

    // 2. Seed Admin User (if it doesn't exist)
    console.log('Seeding admin user...');
    const adminUser = await db.query.users.findFirst({ where: eq(schema.users.email, 'admin@example.com') });
    if (!adminUser) {
        await db.insert(schema.users).values({
            name: 'Admin User',
            email: 'admin@example.com',
            passwordHash: adminPassword,
            roleId: adminRole.id,
            status: 'approved',
        });
    }

    // 3. Seed Pending Users
    console.log('Seeding pending users...');
    await db.insert(schema.users).values([
        {
            name: 'Pending Technician',
            email: 'tech@example.com',
            passwordHash: await bcrypt.hash('password', 10),
            status: 'pending',
            roleId: techRole.id,
        },
        {
            name: 'Pending Client',
            email: 'client@example.com',
            passwordHash: await bcrypt.hash('password', 10),
            status: 'pending',
            roleId: clientRole.id,
        },
    ]).onConflictDoNothing(); // Prevents errors if they already exist

    // 4. Seed Assets
    console.log('Seeding assets...');
    await db.insert(schema.assets).values([
        {
            name: 'Generator G-100',
            model: 'PowerMax 5000',
            serial: 'PM5K-001',
            status: 'active',
            location: 'Main Power Room',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Generator',
        },
        {
            name: 'HVAC Unit A-20',
            model: 'CoolBreeze 20X',
            serial: 'CB20X-045',
            status: 'in-repair',
            location: 'Rooftop Section A',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=HVAC',
        },
        {
            name: 'Water Pump P-05',
            model: 'AquaFlow 300',
            serial: 'AF300-112',
            status: 'active',
            location: 'Basement Level 2',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Water+Pump',
        },
    ]).onConflictDoNothing(); // Prevents errors if they already exist

    console.log('✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

main();
