import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { assetService } from '@/lib/services/api/assets';
import { userService } from '@/lib/services/api/users';
import { AssetStats, MaintenanceRecord } from '@ems/shared/types/asset';
import { User } from '@ems/shared/types/user';

export interface DashboardData {
  stats: AssetStats | null;
  recentActivity: any[];
  maintenanceTasks: any[];
  users: User[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboardData = (): DashboardData => {
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data in parallel
      const [statsData, maintenanceData, usersData] = await Promise.all([
        assetService.getAssetStats(),
        assetService.getMaintenanceRecords('upcoming'),
        userService.getUsers({}, 1, 5) // Get first 5 users
      ]);

      setStats(statsData);
      setMaintenanceTasks(maintenanceData);
      setUsers(usersData.data);
      
      // Simulate recent activity for now
      // In a real app, this would come from an activity log endpoint
      const activity = [
        {
          id: '1',
          type: 'MAINTENANCE',
          date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          description: 'Scheduled maintenance for Industrial Press #45',
          user: usersData.data[0] || { name: 'System' },
          asset: {
            id: 'a45',
            name: 'Industrial Press',
            type: 'MACHINERY',
          },
        },
        {
          id: '2',
          type: 'STATUS_CHANGE',
          date: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          description: 'Updated status to OPERATIONAL for Laptop #123',
          user: usersData.data[1] || { name: 'System' },
          asset: {
            id: 'a123',
            name: 'Laptop',
            type: 'ELECTRONIC',
          },
        },
      ];
      
      setRecentActivity(activity);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      notifications.show({
        title: 'Error',
        message: 'Failed to load dashboard data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    maintenanceTasks,
    users,
    loading,
    error,
    refresh: fetchDashboardData,
  };
};
