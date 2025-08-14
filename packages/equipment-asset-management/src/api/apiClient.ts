import { Asset } from '@ems/shared';

// Read from env; default to localhost for dev
const API_BASE_URL = process.env.NEXT_PUBLIC_ASSET_API_URL || 'http://localhost:3002/api';

export async function getAssets(
  token: string,
  filters?: { status?: string; q?: string; location?: string; department?: string; custodianName?: string }
): Promise<Asset[]> {
  const url = new URL(`${API_BASE_URL}/assets`);
  if (filters?.status) url.searchParams.append('status', filters.status);
  if (filters?.q) url.searchParams.append('q', filters.q);
  if (filters?.location) url.searchParams.append('location', filters.location);
  if (filters?.department) url.searchParams.append('department', filters.department);
  if (filters?.custodianName) url.searchParams.append('custodianName', filters.custodianName);
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch assets');
  }
  return response.json();
}

export async function createAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Asset> {
  const payload: any = {
    name: assetData.name,
    model: assetData.model,
    serialNumber: (assetData as any).serialNumber,
    location: assetData.location,
    status: (assetData as any).status,
    purchaseDate: (assetData as any).purchaseDate,
    department: (assetData as any).department,
    building: (assetData as any).building,
    room: (assetData as any).room,
    custodianId: (assetData as any).custodianId,
    custodianName: (assetData as any).custodianName,
  };
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create asset');
  }
  return response.json();
}

export async function updateAsset(id: string, assetData: Partial<Asset>, token: string): Promise<Asset> {
  const payload: any = {
    name: assetData.name,
    model: assetData.model,
    serialNumber: (assetData as any).serialNumber,
    location: assetData.location,
    status: (assetData as any).status,
    purchaseDate: (assetData as any).purchaseDate,
    department: (assetData as any).department,
    building: (assetData as any).building,
    room: (assetData as any).room,
    custodianId: (assetData as any).custodianId,
    custodianName: (assetData as any).custodianName,
  };
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update asset');
  }
  return response.json();
}

export async function deleteAsset(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete asset');
  }
}

export async function patchAssetStatus(id: string, status: 'OPERATIONAL' | 'IN_REPAIR' | 'DECOMMISSIONED', token: string): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update status');
  }
  return response.json();
}

export async function assignAsset(
  id: string,
  assignment: { department?: string; building?: string; room?: string; custodianId?: string; custodianName?: string },
  token: string,
): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(assignment),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to assign asset');
  }
  return response.json();
}

export async function getAssetActivity(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/assets/${id}/activity`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch activity');
  }
  return response.json();
}
