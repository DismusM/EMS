import { v4 as uuidv4 } from 'uuid';
import { getDb } from '.';
import { User, Asset, ActivityLog } from './schema';

// Helper function to execute SQL and log errors
async function executeQuery(db: any, sql: string, params: any[] = []) {
  try {
    await db.run(sql, params);
    return true;
  } catch (error) {
    console.error('❌ Query failed:', sql);
    console.error('❌ Parameters:', params);
    console.error('❌ Error details:', error);
    throw error;
  }
}

export async function seedDatabase() {
  const db = await getDb();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Begin transaction
    await executeQuery(db, 'BEGIN TRANSACTION');
    
    // Disable foreign key checks temporarily
    await executeQuery(db, 'PRAGMA foreign_keys = OFF');
    
    // Clear existing data in the correct order to respect foreign key constraints
    console.log('🧹 Clearing existing data...');
    await executeQuery(db, 'DELETE FROM activity_log');
    await executeQuery(db, 'DELETE FROM assets');
    await executeQuery(db, 'DELETE FROM users');
    
    // Re-enable foreign key checks
    await executeQuery(db, 'PRAGMA foreign_keys = ON');

    // Seed users
    console.log('👥 Seeding users...');
    const adminUser: User = {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: '', // Password should be set via the UI
      role: 'admin',
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const regularUser: User = {
      id: 'user1',
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash: '', // Password should be set via the UI
      role: 'user',
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Insert users
    await executeQuery(
      db,
      'INSERT INTO users (id, name, email, passwordHash, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        adminUser.id,
        adminUser.name,
        adminUser.email,
        adminUser.passwordHash,
        adminUser.role,
        adminUser.status,
        adminUser.createdAt,
        adminUser.updatedAt
      ]
    );

    await executeQuery(
      db,
      'INSERT INTO users (id, name, email, passwordHash, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        regularUser.id,
        regularUser.name,
        regularUser.email,
        regularUser.passwordHash,
        regularUser.role,
        regularUser.status,
        regularUser.createdAt,
        regularUser.updatedAt
      ]
    );

    // Seed assets
    console.log('💻 Seeding assets...');
    const sampleAssets = [
      {
        id: 'asset1',
        name: 'Laptop Dell XPS 15',
        model: 'XPS 15 9500',
        serialNumber: 'DLXPS159500001',
        location: 'IT Department',
        status: 'in_use',
        purchaseDate: Date.now() - 1000 * 60 * 60 * 24 * 180, // 6 months ago
        department: 'IT',
        building: 'Main',
        room: '101',
        custodianId: 'admin',
        custodianName: 'Admin User',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 1 month ago
      },
      {
        id: 'asset2',
        name: 'Monitor Dell UltraSharp 27"',
        model: 'U2720Q',
        serialNumber: 'DLU2720Q001',
        location: 'IT Department',
        status: 'available',
        purchaseDate: Date.now() - 1000 * 60 * 60 * 24 * 90, // 3 months ago
        department: 'IT',
        building: 'Main',
        room: '101',
        custodianId: null,
        custodianName: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
      },
      {
        id: 'asset3',
        name: 'iPhone 13 Pro',
        model: 'A2487',
        serialNumber: 'IP13P001',
        location: 'Sales Department',
        status: 'in_use',
        purchaseDate: Date.now() - 1000 * 60 * 60 * 24 * 60, // 2 months ago
        department: 'Sales',
        building: 'Main',
        room: '201',
        custodianId: 'user1',
        custodianName: 'Regular User',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      },
    ];

    // Insert assets
    for (const asset of sampleAssets) {
      await executeQuery(
        db,
        'INSERT INTO assets (id, name, model, serialNumber, location, status, purchaseDate, department, building, room, custodianId, custodianName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          asset.id,
          asset.name,
          asset.model || null,
          asset.serialNumber,
          asset.location || null,
          asset.status,
          asset.purchaseDate || null,
          asset.department || null,
          asset.building || null,
          asset.room || null,
          asset.custodianId || null,
          asset.custodianName || null,
          asset.createdAt,
          asset.updatedAt
        ]
      );
    }

    // Seed activity logs
    console.log('📝 Seeding activity logs...');
    const now = Date.now();
    const activityLogs = [
      {
        id: `log-${now}-1`,
        userId: 'admin',
        action: 'create',
        entityType: 'user',
        entityId: 'admin',
        details: 'System: Initial admin user created',
        createdAt: adminUser.createdAt,
      },
      {
        id: `log-${now}-2`,
        userId: 'admin',
        action: 'create',
        entityType: 'user',
        entityId: 'user1',
        details: 'Regular user account created by admin',
        createdAt: regularUser.createdAt,
      },
      ...sampleAssets.map((asset, index) => {
        // Use admin user ID for system-generated logs
        const logUserId = asset.custodianId || adminUser.id;
        return {
          id: `log-${now}-${3 + index}`,
          userId: logUserId,
          action: 'create',
          entityType: 'asset',
          entityId: asset.id,
          details: `Asset ${asset.name} (${asset.serialNumber}) was added to the system`,
          createdAt: asset.createdAt,
        };
      }),
    ];

    // Insert activity logs
    for (const log of activityLogs) {
      await executeQuery(
        db,
        'INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          log.id,
          log.userId || null,
          log.action,
          log.entityType,
          log.entityId,
          log.details || null,
          log.createdAt
        ]
      );
    }

    // Commit transaction
    await executeQuery(db, 'COMMIT');
    
    console.log('✅ Database seeded successfully');
    return true;
  } catch (error) {
    // Rollback transaction on error
    await executeQuery(db, 'ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
}
