import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import path from 'path';

// Helper function to transform database status to frontend format
function transformStatus(status: string): 'active' | 'in-repair' | 'inactive' {
  return status === 'available' ? 'active' : 
         status === 'maintenance' ? 'in-repair' : 'inactive';
}

export async function GET(request: NextRequest) {
  try {
    const DB_PATH = path.join(process.cwd(), 'data', 'ems.db');
    const db = new Database(DB_PATH);
    
    // Get all assets from the database
    const assets = db.prepare('SELECT * FROM assets ORDER BY createdAt DESC').all();
    db.close();
    
    // Transform the data for the frontend
    const transformedAssets = assets.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      model: asset.model || '',
      serial: asset.serialNumber,
      location: asset.location || '',
      status: transformStatus(asset.status),
      purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString() : null,
      department: asset.department || '',
      building: asset.building || '',
      room: asset.room || '',
      custodianId: asset.custodianId,
      custodianName: asset.custodianName || '',
      createdAt: new Date(asset.createdAt).toISOString(),
      updatedAt: asset.updatedAt ? new Date(asset.updatedAt).toISOString() : null
    }));
    
    return NextResponse.json(transformedAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const DB_PATH = path.join(process.cwd(), 'data', 'ems.db');
    const db = new Database(DB_PATH);
    const body = await request.json();
    const { 
      name, 
      model, 
      serial_number, 
      location, 
      status = 'in_use',
      department,
      building,
      room,
      custodianId,
      custodianName
    } = body;

    // Check if asset with this serial number already exists
    const existingAsset = db.prepare('SELECT id FROM assets WHERE serialNumber = ?').get(serial_number);

    if (existingAsset) {
      return NextResponse.json(
        { error: 'An asset with this serial number already exists' },
        { status: 400 }
      );
    }

    // Insert the new asset
    const now = Date.now();
    const assetId = `asset-${uuidv4()}`;
    
    db.prepare(
      'INSERT INTO assets (id, name, model, serialNumber, location, status, department, building, room, custodianId, custodianName, purchaseDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      assetId,
      name,
      model || null,
      serial_number,
      location || null,
      status,
      department || null,
      building || null,
      room || null,
      custodianId || null,
      custodianName || null,
      body.purchaseDate ? new Date(body.purchaseDate).getTime() : null,
      now,
      now
    );

    // Log the activity
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    db.prepare(
      'INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(logId, 'admin', 'create', 'asset', assetId, `Asset ${name} created with serial ${serial_number}`, now);

    // Get the created asset
    const newAsset: any = db.prepare('SELECT * FROM assets WHERE id = ?').get(assetId);
    db.close();
    
    const transformedAsset = {
      id: newAsset.id,
      name: newAsset.name,
      model: newAsset.model || '',
      serial: newAsset.serialNumber,
      location: newAsset.location || '',
      status: transformStatus(newAsset.status),
      department: newAsset.department || '',
      building: newAsset.building || '',
      room: newAsset.room || '',
      custodianId: newAsset.custodianId,
      custodianName: newAsset.custodianName || '',
      createdAt: new Date(newAsset.createdAt).toISOString(),
      updatedAt: newAsset.updatedAt ? new Date(newAsset.updatedAt).toISOString() : null
    };

    return NextResponse.json(transformedAsset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' }, 
      { status: 500 }
    );
  }
}
