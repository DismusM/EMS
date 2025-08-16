'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { 
  Card, 
  Grid, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Badge,
  SimpleGrid,
  Progress,
  ActionIcon
} from '@mantine/core';
import { IconUsers, IconTool, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { authState } = useAuth();

  if (!authState.token) return null;

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Dashboard</Title>
            <Text c="dimmed">Welcome back, {authState.user?.name}</Text>
          </Group>

          <DashboardStats />
          <RecentActivity />
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}

function DashboardStats() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
      <Card withBorder padding="lg">
        <Group justify="space-between">
          <div>
            <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
              Total Assets
            </Text>
            <Text fw={700} size="xl">
              24
            </Text>
          </div>
          <ActionIcon variant="light" size="xl" radius="md" color="blue">
            <IconTool size="1.8rem" />
          </ActionIcon>
        </Group>
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between">
          <div>
            <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
              Operational
            </Text>
            <Text fw={700} size="xl">
              18
            </Text>
          </div>
          <ActionIcon variant="light" size="xl" radius="md" color="green">
            <IconCheck size="1.8rem" />
          </ActionIcon>
        </Group>
        <Progress value={75} mt="md" size="sm" color="green" />
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between">
          <div>
            <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
              In Repair
            </Text>
            <Text fw={700} size="xl">
              4
            </Text>
          </div>
          <ActionIcon variant="light" size="xl" radius="md" color="yellow">
            <IconAlertTriangle size="1.8rem" />
          </ActionIcon>
        </Group>
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between">
          <div>
            <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
              Active Users
            </Text>
            <Text fw={700} size="xl">
              12
            </Text>
          </div>
          <ActionIcon variant="light" size="xl" radius="md" color="violet">
            <IconUsers size="1.8rem" />
          </ActionIcon>
        </Group>
      </Card>
    </SimpleGrid>
  );
}

function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: 'Asset registered',
      item: 'Industrial Printer #IP-001',
      user: 'John Doe',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: 'Maintenance completed',
      item: 'Conveyor Belt #CB-003',
      user: 'Jane Smith',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      action: 'Asset status changed',
      item: 'Forklift #FL-002',
      user: 'Mike Johnson',
      time: '1 day ago',
      status: 'warning'
    },
    {
      id: 4,
      action: 'New user registered',
      item: 'Sarah Wilson',
      user: 'System',
      time: '2 days ago',
      status: 'info'
    }
  ];

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Card withBorder padding="lg">
          <Title order={3} mb="md">Recent Activity</Title>
          <Stack gap="sm">
            {activities.map((activity) => (
              <Group key={activity.id} justify="space-between" p="sm" style={{ borderRadius: '8px', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <div>
                  <Text fw={500}>{activity.action}</Text>
                  <Text size="sm" c="dimmed">{activity.item}</Text>
                  <Text size="xs" c="dimmed">by {activity.user}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge 
                    color={
                      activity.status === 'success' ? 'green' : 
                      activity.status === 'warning' ? 'yellow' : 
                      activity.status === 'info' ? 'blue' : 'gray'
                    }
                    variant="light"
                    size="sm"
                  >
                    {activity.status}
                  </Badge>
                  <Text size="xs" c="dimmed" mt={4}>{activity.time}</Text>
                </div>
              </Group>
            ))}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">Quick Actions</Title>
            <Stack gap="sm">
              <Link href="/assets" style={{ textDecoration: 'none' }}>
                <Card withBorder padding="sm" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Text fw={500}>Manage Assets</Text>
                  <Text size="sm" c="dimmed">View and manage equipment</Text>
                </Card>
              </Link>
              <Link href="/users" style={{ textDecoration: 'none' }}>
                <Card withBorder padding="sm" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Text fw={500}>User Management</Text>
                  <Text size="sm" c="dimmed">Manage user accounts</Text>
                </Card>
              </Link>
            </Stack>
          </Card>

          <Card withBorder padding="lg">
            <Title order={4} mb="md">System Status</Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Database</Text>
                <Badge color="green" variant="light" size="sm">Online</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">API Services</Text>
                <Badge color="green" variant="light" size="sm">Healthy</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Last Backup</Text>
                <Text size="sm" c="dimmed">2 hours ago</Text>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
