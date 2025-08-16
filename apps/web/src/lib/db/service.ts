import { v4 as uuidv4 } from 'uuid';
import { getDb, User, NewUser, Asset, NewAsset } from '.';
import { queryOne, queryAll, execute, logActivity } from './utils';

// User related operations
export const userService = {
  // Find a user by ID
  async findById(id: string): Promise<User | null> {
    const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) return null;
    return user;
  },

  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    const user = await queryOne<User>('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return null;
    return user;
  },

  // Create a new user
  async create(userData: NewUser): Promise<User> {
    const now = Date.now();
    const userId = userData.id || `user-${uuidv4()}`;
    
    const newUser: User = {
      ...userData,
      id: userId,
      createdAt: now,
      updatedAt: now,
    };

    await execute(
      'INSERT INTO users (id, name, email, passwordHash, role, status, createdAt, updatedAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.passwordHash,
        newUser.role,
        newUser.status,
        newUser.createdAt,
        newUser.updatedAt,
        newUser.lastLogin || null
      ]
    );

    // Log the activity
    await logActivity({
      userId: newUser.id,
      action: 'create',
      entityType: 'user',
      entityId: newUser.id,
      details: `User ${newUser.name} (${newUser.email}) was created`,
      createdAt: now,
    });

    return newUser;
  },

  // Update a user
  async update(id: string, userData: Partial<NewUser>): Promise<User | null> {
    const existingUser = await this.findById(id);
    if (!existingUser) return null;

    const now = Date.now();
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id, // Ensure ID doesn't change
      updatedAt: now,
    };

    await execute(
      'UPDATE users SET name = ?, email = ?, passwordHash = ?, role = ?, status = ?, updatedAt = ?, lastLogin = ? WHERE id = ?',
      [
        updatedUser.name,
        updatedUser.email,
        updatedUser.passwordHash,
        updatedUser.role,
        updatedUser.status,
        updatedUser.updatedAt,
        updatedUser.lastLogin || null,
        id
      ]
    );

    // Log the activity
    await logActivity({
      userId: id,
      action: 'update',
      entityType: 'user',
      entityId: id,
      details: 'User details were updated',
      createdAt: now,
    });

    return updatedUser;
  },

  // Delete a user
  async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.changes > 0) {
      // Log the activity
      await logActivity({
        userId: id,
        action: 'delete',
        entityType: 'user',
        entityId: id,
        details: 'User was deleted',
        createdAt: Date.now(),
      });
      
      return true;
    }
    
    return false;
  },

  // List all users with pagination
  async list(page: number = 1, pageSize: number = 10, search: string = '') {
    let where = '1=1';
    const params: any[] = [];
    
    if (search) {
      where += ' AND (name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    return getPaginated<User>('users', page, pageSize, where, params, 'name ASC');
  },
};

// Asset related operations
export const assetService = {
  // Find an asset by ID
  async findById(id: string): Promise<Asset | null> {
    const asset = await queryOne<Asset>('SELECT * FROM assets WHERE id = ?', [id]);
    if (!asset) return null;
    return asset;
  },

  // Find an asset by serial number
  async findBySerialNumber(serialNumber: string): Promise<Asset | null> {
    const asset = await queryOne<Asset>('SELECT * FROM assets WHERE serialNumber = ?', [serialNumber]);
    if (!asset) return null;
    return asset;
  },

  // Create a new asset
  async create(assetData: NewAsset): Promise<Asset> {
    const now = Date.now();
    const assetId = assetData.id || `asset-${uuidv4()}`;
    
    const newAsset: Asset = {
      ...assetData,
      id: assetId,
      status: assetData.status || 'available',
      createdAt: now,
      updatedAt: now,
    };

    await execute(
      'INSERT INTO assets (id, name, model, serialNumber, location, status, purchaseDate, department, building, room, custodianId, custodianName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newAsset.id,
        newAsset.name,
        newAsset.model || null,
        newAsset.serialNumber,
        newAsset.location || null,
        newAsset.status,
        newAsset.purchaseDate || null,
        newAsset.department || null,
        newAsset.building || null,
        newAsset.room || null,
        newAsset.custodianId || null,
        newAsset.custodianName || null,
        newAsset.createdAt,
        newAsset.updatedAt
      ]
    );

    // Log the activity
    await logActivity({
      userId: newAsset.custodianId || null,
      action: 'create',
      entityType: 'asset',
      entityId: newAsset.id,
      details: `Asset ${newAsset.name} (${newAsset.serialNumber}) was created`,
      createdAt: now,
    });

    return newAsset;
  },

  // Update an asset
  async update(id: string, assetData: Partial<NewAsset>): Promise<Asset | null> {
    const existingAsset = await this.findById(id);
    if (!existingAsset) return null;

    const now = Date.now();
    const updatedAsset: Asset = {
      ...existingAsset,
      ...assetData,
      id, // Ensure ID doesn't change
      updatedAt: now,
    };

    await execute(
      'UPDATE assets SET name = ?, model = ?, serialNumber = ?, location = ?, status = ?, purchaseDate = ?, department = ?, building = ?, room = ?, custodianId = ?, custodianName = ?, updatedAt = ? WHERE id = ?',
      [
        updatedAsset.name,
        updatedAsset.model || null,
        updatedAsset.serialNumber,
        updatedAsset.location || null,
        updatedAsset.status,
        updatedAsset.purchaseDate || null,
        updatedAsset.department || null,
        updatedAsset.building || null,
        updatedAsset.room || null,
        updatedAsset.custodianId || null,
        updatedAsset.custodianName || null,
        updatedAsset.updatedAt,
        id
      ]
    );

    // Log the activity
    await logActivity({
      userId: updatedAsset.custodianId || null,
      action: 'update',
      entityType: 'asset',
      entityId: id,
      details: 'Asset details were updated',
      createdAt: now,
    });

    return updatedAsset;
  },

  // Delete an asset
  async delete(id: string): Promise<boolean> {
    const result = await execute('DELETE FROM assets WHERE id = ?', [id]);
    
    if (result.changes > 0) {
      // Log the activity
      await logActivity({
        action: 'delete',
        entityType: 'asset',
        entityId: id,
        details: 'Asset was deleted',
        createdAt: Date.now(),
      });
      
      return true;
    }
    
    return false;
  },

  // List all assets with pagination and filtering
  async list(
    page: number = 1, 
    pageSize: number = 10, 
    search: string = '',
    status?: string,
    department?: string
  ) {
    let where = '1=1';
    const params: any[] = [];
    
    if (search) {
      where += ' AND (name LIKE ? OR model LIKE ? OR serialNumber LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }
    
    if (department) {
      where += ' AND department = ?';
      params.push(department);
    }
    
    return getPaginated<Asset>('assets', page, pageSize, where, params, 'name ASC');
  },
};

// Activity log related operations
export const activityService = {
  // Get activity log for a specific entity
  async getEntityActivity(entityType: string, entityId: string, limit: number = 50) {
    return queryAll<ActivityLog>(
      'SELECT * FROM activity_log WHERE entityType = ? AND entityId = ? ORDER BY createdAt DESC LIMIT ?',
      [entityType, entityId, limit]
    );
  },

  // Get user activity
  async getUserActivity(userId: string, limit: number = 50) {
    return queryAll<ActivityLog>(
      'SELECT * FROM activity_log WHERE userId = ? ORDER BY createdAt DESC LIMIT ?',
      [userId, limit]
    );
  },

  // Get recent activity
  async getRecentActivity(limit: number = 50) {
    return queryAll<ActivityLog>(
      'SELECT * FROM activity_log ORDER BY createdAt DESC LIMIT ?',
      [limit]
    );
  },
};

// Re-export the getPaginated function from utils
export { getPaginated } from './utils';
