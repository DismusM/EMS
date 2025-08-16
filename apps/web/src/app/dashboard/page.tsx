'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  Stack, 
  Title, 
  Text, 
  Badge, 
  Button, 
  Group, 
  Alert, 
  Card, 
  Progress, 
  SimpleGrid, 
  Paper, 
  Avatar, 
  Center, 
  Loader 
} from '@mantine/core';
import { 
  IconAlertTriangle, 
  IconCheck, 
  IconRefresh, 
  IconTools, 
  IconPlus, 
  IconClock, 
  IconAlertCircle, 
  IconUser, 
  IconChartBar, 
  IconActivity 
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { notifications } from '@mantine/notifications';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AssetStatus, MaintenanceStatus, PriorityLevel } from '@ems/shared';

// Mock data - In a real app, this would come from an API
const mockAssetStats = {
  total: 128,
  byStatus: {
    OPERATIONAL: 98,
    MAINTENANCE: 15,
    DECOMMISSIONED: 5,
    OUT_OF_SERVICE: 7,
    IN_REPAIR: 3,
    LOST: 0,
    STOLEN: 0,
  },
  byType: {
    EQUIPMENT: 45,
    VEHICLE: 12,
    TOOL: 32,
    ELECTRONIC: 25,
    FURNITURE: 10,
    MACHINERY: 4,
    OTHER: 0,
  },
  maintenance: {
    dueSoon: 8,
    overdue: 3,
    inProgress: 5,
  },
  recentActivity: [
    {
      id: '1',
      type: 'MAINTENANCE',
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      description: 'Scheduled maintenance for Industrial Press #45',
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '',
      },
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
      user: {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '',
      },
      asset: {
        id: 'a123',
        name: 'Laptop',
        type: 'ELECTRONIC',
      },
    },
  ],
};

const mockMaintenanceTasks = [
  {
    id: 'm1',
    assetId: 'a45',
    assetName: 'Industrial Press #45',
    type: 'ROUTINE',
    title: 'Quarterly Maintenance',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
  },
  {
    id: 'm2',
    assetId: 'a123',
    assetName: 'Laptop #123',
    type: 'REPAIR',
    title: 'Keyboard replacement',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignedTo: 'u1',
  },
  {
    id: 'm3',
    assetId: 'a67',
    assetName: 'Forklift #3',
    type: 'INSPECTION',
    title: 'Annual inspection',
    status: 'OVERDUE',
    priority: 'HIGH',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
];

export default function DashboardPage() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [assetStats, setAssetStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [error, setError] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setAssetStats(mockAssetStats);
          setRecentActivity(mockAssetStats.recentActivity);
          setMaintenanceTasks(mockMaintenanceTasks);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load dashboard data');
        setIsLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Simulate refresh
    setTimeout(() => {
      setAssetStats(mockAssetStats);
      setRecentActivity(mockAssetStats.recentActivity);
      setMaintenanceTasks(mockMaintenanceTasks);
      setIsLoading(false);
      notifications.show({
        title: 'Dashboard updated',
        message: 'The dashboard data has been refreshed.',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }, 800);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'green';
      case 'MAINTENANCE':
        return 'orange';
      case 'DECOMMISSIONED':
        return 'gray';
      case 'OUT_OF_SERVICE':
        return 'red';
      case 'IN_REPAIR':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getMaintenanceStatusBadge = (status, dueDate) => {
    const now = new Date();
    const isOverdue = dueDate && new Date(dueDate) < now;
    
    if (isOverdue) {
      return (
        <Badge color="red" variant="light" leftSection={<IconAlertCircle size={14} />}>
          OVERDUE
        </Badge>
      );
    }
    
    switch (status) {
      case 'PENDING':
        return <Badge color="yellow">PENDING</Badge>;
      case 'IN_PROGRESS':
        return <Badge color="blue">IN PROGRESS</Badge>;
      case 'COMPLETED':
        return <Badge color="green">COMPLETED</Badge>;
      case 'CANCELLED':
        return <Badge color="gray">CANCELLED</Badge>;
      case 'SCHEDULED':
        return <Badge color="violet">SCHEDULED</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AuthGuard redirectTo="/">
        <AppLayout>
          <Center style={{ height: '60vh' }}>
            <Stack align="center">
              <Loader size="lg" />
              <Text>Loading dashboard data...</Text>
            </Stack>
          </Center>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard redirectTo="/">
      <AppLayout>
        <Stack spacing="lg">
          <Group position="apart" align="center">
            <div>
              <Title order={2}>Dashboard</Title>
              <Text color="dimmed">
                Welcome back, {authState.user?.name || 'User'}. Here's what's happening with your assets.
              </Text>
            </div>
            <Button 
              leftIcon={<IconRefresh size={16} />} 
              variant="outline"
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
          </Group>

          {error && (
            <Alert 
              icon={<IconAlertTriangle size={18} />} 
              title="Error loading dashboard" 
              color="red"
              variant="outline"
            >
              {error}
            </Alert>
          )}

          {/* Asset Status Overview */}
          <Card withBorder radius="md" p="xl">
            <Group position="apart" mb="md">
              <Text size="lg" weight={600}>Asset Status</Text>
              <Badge color="blue" variant="light">
                {assetStats?.total} Total Assets
              </Badge>
            </Group>
            
            <Stack spacing="sm">
              {Object.entries(assetStats?.byStatus || {}).map(([status, count]) => (
                <div key={status}>
                  <Group position="apart" mb={5}>
                    <Text size="sm" color="dimmed">
                      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
                    </Text>
                    <Text weight={600}>
                      {count}
                    </Text>
                  </Group>
                  <Progress 
                    value={(count / assetStats.total) * 100} 
                    color={getStatusBadgeColor(status)}
                    size="sm"
                    radius="xl"
                  />
                </div>
              ))}
            </Stack>
          </Card>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {/* Maintenance Overview */}
            <Card withBorder radius="md" p="md">
              <Group position="apart" mb="md">
                <Text size="lg" weight={600}>Maintenance</Text>
                <Badge 
                  color={assetStats?.maintenance.overdue > 0 ? 'red' : 'green'}
                  variant="light"
                  leftSection={
                    assetStats?.maintenance.overdue > 0 ? 
                    <IconAlertTriangle size={12} style={{ marginRight: 4 }} /> : 
                    <IconCheck size={12} style={{ marginRight: 4 }} />
                  }
                >
                  {assetStats?.maintenance.overdue} {assetStats?.maintenance.overdue === 1 ? 'Issue' : 'Issues'}
                </Badge>
              </Group>
              
              <Stack spacing="xs">
                <Group position="apart">
                  <Text size="sm" color="dimmed">Due Soon</Text>
                  <Badge color="yellow" variant="light">
                    {assetStats?.maintenance.dueSoon}
                  </Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm" color="dimmed">Overdue</Text>
                  <Badge color="red" variant="light">
                    {assetStats?.maintenance.overdue}
                  </Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm" color="dimmed">In Progress</Text>
                  <Badge color="blue" variant="light">
                    {assetStats?.maintenance.inProgress}
                  </Badge>
                </Group>
              </Stack>
              
              <Button 
                fullWidth 
                variant="light" 
                leftIcon={<IconTools size={16} />}
                mt="md"
                component="a"
                href="/work-orders"
              >
                View All Work Orders
              </Button>
            </Card>

            {/* Asset Distribution */}
            <Card withBorder radius="md" p="md">
              <Text size="lg" weight={600} mb="md">Asset Distribution</Text>
              <Stack spacing="xs">
                {Object.entries(assetStats?.byType || {}).map(([type, count]) => (
                  <div key={type}>
                    <Group position="apart" mb={4}>
                      <Text size="sm">
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </Text>
                      <Text size="sm" weight={600}>
                        {count}
                      </Text>
                    </Group>
                    <Progress 
                      value={(count / assetStats.total) * 100} 
                      color="blue"
                      size="sm"
                      radius="xl"
                    />
                  </div>
                ))}
              </Stack>
              <Button 
                fullWidth 
                variant="light" 
                leftIcon={<IconPlus size={16} />}
                mt="md"
                component="a"
                href="/assets/new"
              >
                Add New Asset
              </Button>
            </Card>
          </SimpleGrid>

          {/* Recent Activity */}
          <Card withBorder radius="md" p="md">
            <Text size="lg" weight={600} mb="md">Recent Activity</Text>
            <Stack spacing="md">
              {recentActivity.map((activity) => (
                <Paper key={activity.id} withBorder p="md" radius="sm">
                  <Group position="apart" mb="xs">
                    <Group spacing="xs">
                      <Avatar 
                        src={activity.user?.avatarUrl} 
                        alt={activity.user?.name}
                        size="sm"
                        radius="xl"
                      >
                        {activity.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Text size="sm" weight={500}>
                        {activity.user?.name || 'System'}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </Text>
                    </Group>
                    <Badge color="blue" variant="light" size="sm">
                      {activity.type.replace(/_/g, ' ')}
                    </Badge>
                  </Group>
                  <Text size="sm">
                    {activity.description}
                  </Text>
                  {activity.asset && (
                    <Badge 
                      variant="outline" 
                      color="blue" 
                      size="sm" 
                      mt="xs"
                      component="a"
                      href={`/assets/${activity.asset.id}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {activity.asset.name}
                    </Badge>
                  )}
                </Paper>
              ))}
            </Stack>
            <Button 
              fullWidth 
              variant="light" 
              mt="md"
              component="a"
              href="/activity"
            >
              View All Activity
            </Button>
          </Card>

          {/* Upcoming Maintenance */}
          <Card withBorder radius="md" p="md">
            <Group position="apart" mb="md">
              <Text size="lg" weight={600}>Upcoming Maintenance</Text>
              <Badge color="orange" variant="light">
                {maintenanceTasks.length} Tasks
              </Badge>
            </Group>
            
            <Stack spacing="xs">
              {maintenanceTasks.map((task) => (
                <Paper key={task.id} withBorder p="md" radius="sm">
                  <Group position="apart" mb="xs">
                    <Text weight={600}>{task.title}</Text>
                    {getMaintenanceStatusBadge(task.status, task.dueDate)}
                  </Group>
                  <Group position="apart" mb="xs">
                    <Text size="sm" color="dimmed">
                      {task.assetName}
                    </Text>
                    {task.dueDate && (
                      <Text size="sm" color="dimmed">
                        <Group spacing={4}>
                          <IconClock size={14} />
                          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </Group>
                      </Text>
                    )}
                  </Group>
                  <Group position="apart">
                    <Badge 
                      color={getPriorityBadgeColor(task.priority)}
                      variant="light"
                    >
                      {task.priority}
                    </Badge>
                    <Button 
                      variant="light" 
                      size="xs"
                      component="a"
                      href={`/work-orders/${task.id}`}
                    >
                      View Details
                    </Button>
                  </Group>
                </Paper>
              ))}
            </Stack>
            
            <Button 
              fullWidth 
              variant="light" 
              leftIcon={<IconPlus size={16} />}
              mt="md"
              component="a"
              href="/work-orders/new"
            >
              Create Work Order
            </Button>
          </Card>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
