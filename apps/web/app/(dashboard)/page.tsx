'use client';

import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { Card, Grid, Stack, Text, Title, Group } from '@mantine/core';
import { IconUsers, IconTool, IconClipboardCheck, IconTrendingUp } from '@tabler/icons-react';

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

          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Card withBorder>
                <Group>
                  <IconUsers size="2rem" color="#1e88e5" />
                  <div>
                    <Text size="sm" c="dimmed">Total Users</Text>
                    <Text size="xl" fw={700}>24</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Card withBorder>
                <Group>
                  <IconTool size="2rem" color="#1e88e5" />
                  <div>
                    <Text size="sm" c="dimmed">Active Assets</Text>
                    <Text size="xl" fw={700}>156</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Card withBorder>
                <Group>
                  <IconClipboardCheck size="2rem" color="#1e88e5" />
                  <div>
                    <Text size="sm" c="dimmed">Pending Tasks</Text>
                    <Text size="xl" fw={700}>8</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Card withBorder>
                <Group>
                  <IconTrendingUp size="2rem" color="#1e88e5" />
                  <div>
                    <Text size="sm" c="dimmed">Efficiency</Text>
                    <Text size="xl" fw={700}>94%</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Card withBorder>
                <Title order={4} mb="md">Recent Activity</Title>
                <Stack gap="sm">
                  <Text size="sm">Generator G-100 maintenance completed by John Smith</Text>
                  <Text size="sm">New user registration pending approval</Text>
                  <Text size="sm">HVAC Unit A-20 status updated to "In Repair"</Text>
                  <Text size="sm">Weekly maintenance report generated</Text>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Card withBorder>
                <Title order={4} mb="md">Quick Actions</Title>
                <Stack gap="xs">
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    Schedule Maintenance
                  </Text>
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    Add New Asset
                  </Text>
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    Generate Report
                  </Text>
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                    View Pending Tasks
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
