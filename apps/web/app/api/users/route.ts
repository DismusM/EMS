import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import path from 'path';

// Helper function to transform user data for frontend
function transformUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
    lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : null
  };
}

export async function GET() {
  try {
    const DB_PATH = path.join(process.cwd(), 'data', 'ems.db');
    const db = new Database(DB_PATH);
    const users = db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
    db.close();
    
    const transformedUsers = users.map(transformUser);
    
    return NextResponse.json({ 
      users: transformedUsers,
      count: transformedUsers.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const DB_PATH = path.join(process.cwd(), 'data', 'ems.db');
    const db = new Database(DB_PATH);
    const body = await request.json();
    const { name, email, role } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Insert the new user
    const now = Date.now();
    const userId = `user-${uuidv4()}`;
    
    db.prepare(
      'INSERT INTO users (id, name, email, role, status, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(userId, name, email, role.toUpperCase(), 'pending', '', now, now);

    // Log the activity
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    db.prepare(
      'INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(logId, 'admin', 'create', 'user', userId, `User ${name} created with role ${role}`, now);

    // Get the created user
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    db.close();

    // Transform for frontend (don't include sensitive data)
    const transformedUser = transformUser(newUser);

    return NextResponse.json(transformedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' }, 
      { status: 500 }
    );
  }
}
