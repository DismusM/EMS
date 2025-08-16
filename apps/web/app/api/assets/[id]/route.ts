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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, model, serial_number, location, status } = body;

    const assetIndex = mockAssets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Update the asset
    mockAssets[assetIndex] = {
      ...mockAssets[assetIndex],
      name: name || mockAssets[assetIndex].name,
      model: model || mockAssets[assetIndex].model,
      serial: serial_number || mockAssets[assetIndex].serial,
      location: location || mockAssets[assetIndex].location,
      status: status || mockAssets[assetIndex].status,
      updated_at: new Date().toISOString()
    };

    // Transform for frontend
    const transformedAsset = {
      ...mockAssets[assetIndex],
      status: mockAssets[assetIndex].status === 'OPERATIONAL' ? 'active' : 
              mockAssets[assetIndex].status === 'IN_MAINTENANCE' ? 'in-repair' : 'inactive'
    };

    return NextResponse.json(transformedAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const assetIndex = mockAssets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    mockAssets.splice(assetIndex, 1);
    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
