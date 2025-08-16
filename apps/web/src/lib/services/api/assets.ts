import { apiClient } from './base';
import { 
  Asset, 
  AssetStatus, 
  AssetType, 
  AssetFilters,
  AssetStats,
  MaintenanceRecord,
  MaintenanceType,
  MaintenancePriority,
  PaginatedResponse
} from '@ems/shared/types/asset';

export const assetService = {
  // Asset CRUD operations
  async getAssets(filters?: AssetFilters, page = 1, limit = 10): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.location && { location: filters.location }),
    });

    return apiClient.get<PaginatedResponse<Asset>>(`/assets?${params.toString()}`);
  },

  async getAssetById(id: string): Promise<Asset> {
    return apiClient.get<Asset>(`/assets/${id}`);
  },

  async createAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    return apiClient.post<Asset>('/assets', assetData);
  },

  async updateAsset(id: string, assetData: Partial<Asset>): Promise<Asset> {
    return apiClient.put<Asset>(`/assets/${id}`, assetData);
  },

  async deleteAsset(id: string): Promise<void> {
    return apiClient.delete(`/assets/${id}`);
  },

  // Asset Statistics
  async getAssetStats(): Promise<AssetStats> {
    return apiClient.get<AssetStats>('/assets/stats');
  },

  // Maintenance Operations
  async getMaintenanceRecords(assetId: string): Promise<MaintenanceRecord[]> {
    return apiClient.get<MaintenanceRecord[]>(`/assets/${assetId}/maintenance`);
  },

  async createMaintenanceRecord(
    assetId: string,
    recordData: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MaintenanceRecord> {
    return apiClient.post<MaintenanceRecord>(
      `/assets/${assetId}/maintenance`,
      recordData
    );
  },

  async updateMaintenanceRecord(
    assetId: string,
    recordId: string,
    recordData: Partial<MaintenanceRecord>
  ): Promise<MaintenanceRecord> {
    return apiClient.put<MaintenanceRecord>(
      `/assets/${assetId}/maintenance/${recordId}`,
      recordData
    );
  },

  async deleteMaintenanceRecord(assetId: string, recordId: string): Promise<void> {
    return apiClient.delete(`/assets/${assetId}/maintenance/${recordId}`);
  },

  // Asset Status Management
  async updateAssetStatus(assetId: string, status: AssetStatus, notes?: string): Promise<Asset> {
    return apiClient.put<Asset>(`/assets/${assetId}/status`, { status, notes });
  },

  // Asset Assignment
  async assignAsset(assetId: string, userId: string): Promise<Asset> {
    return apiClient.put<Asset>(`/assets/${assetId}/assign`, { userId });
  },

  async unassignAsset(assetId: string): Promise<Asset> {
    return apiClient.put<Asset>(`/assets/${assetId}/unassign`);
  },

  // Asset Types
  async getAssetTypes(): Promise<{ id: string; name: string }[]> {
    return apiClient.get<{ id: string; name: string }[]>('/assets/types');
  },

  // Asset Import/Export
  async importAssets(file: File): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{ success: boolean; message: string }>(
      '/assets/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  async exportAssets(filters?: AssetFilters): Promise<Blob> {
    const params = new URLSearchParams({
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await apiClient.get<Blob>(
      `/assets/export?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    
    return response;
  },
};
