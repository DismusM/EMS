import type { User } from './user';

export type AssetStatus = 
  | 'OPERATIONAL' 
  | 'MAINTENANCE' 
  | 'DECOMMISSIONED' 
  | 'OUT_OF_SERVICE' 
  | 'IN_REPAIR' 
  | 'LOST' 
  | 'STOLEN';

export type AssetType = 
  | 'EQUIPMENT' 
  | 'VEHICLE' 
  | 'TOOL' 
  | 'ELECTRONIC' 
  | 'FURNITURE' 
  | 'MACHINERY' 
  | 'OTHER';

export type MaintenanceType = 
  | 'ROUTINE' 
  | 'REPAIR' 
  | 'INSPECTION' 
  | 'UPGRADE' 
  | 'CALIBRATION' 
  | 'SAFETY_CHECK';

export type MaintenanceStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'SCHEDULED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AssetDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: MaintenanceType;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: PriorityLevel;
  startDate: string;
  endDate?: string;
  assignedTo?: string;
  assignedUser?: Pick<User, 'id' | 'name' | 'email'>;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: string;
  partsUsed?: Array<{
    id: string;
    name: string;
    partNumber: string;
    quantity: number;
    unitCost: number;
  }>;
  laborHours?: number;
  laborCost?: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  status: AssetStatus;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  currentValue?: number;
  location: string;
  department?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceInterval?: number; // in days
  assignedTo?: string;
  assignedUser?: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>;
  qrCode?: string;
  barcode?: string;
  notes?: string;
  warrantyExpiration?: string;
  expectedLifespan?: number; // in months
  imageUrl?: string;
  documents?: AssetDocument[];
  maintenanceHistory?: Array<{
    id: string;
    type: MaintenanceType;
    date: string;
    status: MaintenanceStatus;
    description: string;
    completedBy?: string;
  }>;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AssetFormData extends Omit<Asset, 
  'id' | 'createdAt' | 'updatedAt' | 'documents' | 'maintenanceHistory' | 'assignedUser'
> {
  id?: string;
  newDocuments?: File[];
  removedDocumentIds?: string[];
  assignedUserId?: string;
  customFields?: Array<{
    id: string;
    name: string;
    value: any;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    options?: string[];
    required?: boolean;
  }>;
}

export interface AssetFilters {
  status?: AssetStatus[];
  type?: AssetType[];
  location?: string[];
  department?: string[];
  searchQuery?: string;
  assignedTo?: string[];
  purchaseDateRange?: {
    from?: string;
    to?: string;
  };
  maintenanceStatus?: 'NEEDS_MAINTENANCE' | 'DUE_SOON' | 'OVERDUE' | 'ALL_GOOD';
  sortBy?: 'name' | 'purchaseDate' | 'status' | 'type' | 'location' | 'assignedTo';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AssetStats {
  total: number;
  byStatus: Record<AssetStatus, number>;
  byType: Record<AssetType, number>;
  byLocation: Record<string, number>;
  byDepartment: Record<string, number>;
  maintenance: {
    dueSoon: number;
    overdue: number;
    inProgress: number;
  };
  value: {
    total: number;
    byType: Record<AssetType, number>;
    byLocation: Record<string, number>;
  };
  recentActivity: Array<{
    id: string;
    type: 'MAINTENANCE' | 'STATUS_CHANGE' | 'ASSIGNMENT' | 'DOCUMENT_UPLOAD' | 'NOTE_ADDED';
    date: string;
    description: string;
    user?: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    asset?: {
      id: string;
      name: string;
      type: AssetType;
    };
  }>;
  upcomingMaintenance: Array<{
    id: string;
    name: string;
    dueDate: string;
    status: 'DUE_SOON' | 'OVERDUE' | 'UPCOMING';
    assetId: string;
    assetName: string;
    assetType: AssetType;
  }>;
}

export interface MaintenanceFormData extends Omit<MaintenanceRecord, 
  'id' | 'createdAt' | 'updatedAt' | 'assetName' | 'assignedUser' | 'partsUsed' | 'attachments'
> {
  id?: string;
  asset?: {
    id: string;
    name: string;
    type: AssetType;
  };
  assignedUserId?: string;
  newAttachments?: File[];
  removedAttachmentIds?: string[];
  parts?: Array<{
    id?: string;
    name: string;
    partNumber: string;
    quantity: number;
    unitCost: number;
  }>;
}

export interface MaintenanceFilters {
  status?: MaintenanceStatus[];
  type?: MaintenanceType[];
  priority?: PriorityLevel[];
  assignedTo?: string[];
  assetId?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  sortBy?: 'dueDate' | 'priority' | 'status' | 'type';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MaintenanceStats {
  total: number;
  byStatus: Record<MaintenanceStatus, number>;
  byType: Record<MaintenanceType, number>;
  byPriority: Record<PriorityLevel, number>;
  byMonth: Array<{
    month: string;
    count: number;
    completed: number;
    cost: number;
  }>;
  averageResolutionTime: number; // in hours
  totalCost: number;
  costByType: Record<MaintenanceType, number>;
  overdue: number;
  dueThisWeek: number;
}
