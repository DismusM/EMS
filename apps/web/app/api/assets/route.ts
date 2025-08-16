import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production this would connect to your actual database
let mockAssets = [
  {
    id: '1',
    name: 'Industrial Generator G-100',
    model: 'PowerMax 5000',
    serial: 'PM5K-001',
    status: 'OPERATIONAL',
    location: 'Main Power Room',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Generator',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'HVAC Unit A-20',
    model: 'CoolBreeze 20X',
    serial: 'CB20X-045',
    status: 'IN_MAINTENANCE',
    location: 'Rooftop Section A',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=HVAC',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Water Pump P-05',
    model: 'AquaFlow 300',
    serial: 'AF300-112',
    status: 'OPERATIONAL',
    location: 'Basement Level 2',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Water+Pump',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Transform status to frontend format
    const transformedAssets = mockAssets.map(asset => ({
      ...asset,
      status: asset.status === 'OPERATIONAL' ? 'active' : 
              asset.status === 'IN_MAINTENANCE' ? 'in-repair' : 'inactive'
    }));
    
    return NextResponse.json(transformedAssets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, model, serial_number, location, status } = body;

    const newAsset = {
      id: (mockAssets.length + 1).toString(),
      name,
      model: model || '',
      serial: serial_number,
      status: status || 'OPERATIONAL',
      location: location || '',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Asset',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockAssets.push(newAsset);

    // Transform for frontend
    const transformedAsset = {
      ...newAsset,
      status: newAsset.status === 'OPERATIONAL' ? 'active' : 
              newAsset.status === 'IN_MAINTENANCE' ? 'in-repair' : 'inactive'
    };

    return NextResponse.json(transformedAsset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}
