import { Asset } from '@ems/shared';

// Read from env; default to localhost for dev
const API_BASE_URL = process.env.NEXT_PUBLIC_ASSET_API_URL || 'http://localhost:3002/api';

export async function getAssets(token: string): Promise<Asset[]> {
  const response = await fetch(`${API_BASE_URL}/assets`, {
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
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(assetData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create asset');
  }
  return response.json();
}

export async function updateAsset(id: string, assetData: Partial<Asset>, token: string): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(assetData),
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
