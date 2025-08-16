import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production this would connect to your actual database
let mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'TECHNICIAN',
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'SUPERVISOR',
    status: 'approved',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-01-19T16:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'TECHNICIAN',
    status: 'pending',
    createdAt: '2024-01-18T11:20:00Z'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'ASSET_MANAGER',
    status: 'approved',
    createdAt: '2024-01-12T13:45:00Z',
    lastLogin: '2024-01-20T09:30:00Z'
  },
  {
    id: 'admin-1',
    name: 'Default Admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  }
];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    mockUsers[userIndex].status = 'approved';
    return NextResponse.json(mockUsers[userIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 });
  }
}
