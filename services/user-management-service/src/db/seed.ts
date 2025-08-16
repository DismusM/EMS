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

    // Get all roles for comprehensive user seeding
    const supervisorRole = await db.query.roles.findFirst({ where: eq(schema.roles.id, 'supervisor') });
    const assetManagerRole = await db.query.roles.findFirst({ where: eq(schema.roles.id, 'asset-manager') });

    // 2. Seed comprehensive sample users
    console.log('Seeding comprehensive sample users...');
    const sampleUsers = [
        {
            name: 'System Administrator',
            email: 'admin@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: adminRole.id,
            status: 'approved' as const,
        },
        {
            name: 'Sarah Wilson',
            email: 'sarah.wilson@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: assetManagerRole?.id || adminRole.id,
            status: 'approved' as const,
        },
        {
            name: 'Mike Johnson',
            email: 'mike.johnson@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: supervisorRole?.id || adminRole.id,
            status: 'approved' as const,
        },
        {
            name: 'John Smith',
            email: 'john.smith@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: techRole.id,
            status: 'approved' as const,
        },
        {
            name: 'Emily Davis',
            email: 'emily.davis@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: techRole.id,
            status: 'approved' as const,
        },
        {
            name: 'Robert Brown',
            email: 'robert.brown@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: clientRole.id,
            status: 'approved' as const,
        },
        {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: clientRole.id,
            status: 'approved' as const,
        },
        {
            name: 'David Miller',
            email: 'david.miller@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: techRole.id,
            status: 'pending' as const,
        },
        {
            name: 'Jennifer Taylor',
            email: 'jennifer.taylor@ems-demo.com',
            passwordHash: await bcrypt.hash('password123', 10),
            roleId: clientRole.id,
            status: 'pending' as const,
        }
    ];

    for (const user of sampleUsers) {
        await db.insert(schema.users).values(user).onConflictDoNothing();
    }

    // 4. Seed comprehensive sample assets
    console.log('Seeding comprehensive sample assets...');
    await db.insert(schema.assets).values([
        {
            name: 'Industrial Generator G-100',
            model: 'PowerMax 5000',
            serial: 'PM5K-001',
            status: 'active' as const,
            location: 'Main Power Room',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Generator',
        },
        {
            name: 'HVAC Unit A-20',
            model: 'CoolBreeze 20X',
            serial: 'CB20X-045',
            status: 'in-repair' as const,
            location: 'Rooftop Section A',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=HVAC',
        },
        {
            name: 'Water Pump P-05',
            model: 'AquaFlow 300',
            serial: 'AF300-112',
            status: 'active' as const,
            location: 'Basement Level 2',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Water+Pump',
        },
        {
            name: 'Conveyor Belt System CB-003',
            model: 'FlowMax 2000',
            serial: 'FM2K-078',
            status: 'active' as const,
            location: 'Production Floor A',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Conveyor',
        },
        {
            name: 'Forklift FL-002',
            model: 'LiftPro 3500',
            serial: 'LP35-234',
            status: 'in-repair' as const,
            location: 'Warehouse Section B',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Forklift',
        },
        {
            name: 'Air Compressor AC-015',
            model: 'CompressMax 500',
            serial: 'CM500-089',
            status: 'active' as const,
            location: 'Utility Room C',
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Compressor',
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
