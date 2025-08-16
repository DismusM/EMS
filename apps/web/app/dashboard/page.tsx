'use client';

import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { Card, Grid, Stack, Text, Title, Group, Button, Modal, TextInput, Select } from '@mantine/core';
import { IconUsers, IconTool, IconClipboardCheck, IconTrendingUp, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

// Status options for assets
const STATUS_OPTIONS = [
  { value: 'OPERATIONAL', label: 'Operational' },
  { value: 'IN_MAINTENANCE', label: 'In Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const [addAssetModalOpened, setAddAssetModalOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetData, setAssetData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    status: 'OPERATIONAL',
    location: '',
  });

  if (!authState.token) return null;

  const handleAddAsset = async () => {
    if (!assetData.name || !assetData.serialNumber) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          ...assetData,
          serial_number: assetData.serialNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add asset');
      }

      notifications.show({
        title: 'Success',
        message: 'Asset added successfully',
        color: 'green',
      });
      
      setAddAssetModalOpened(false);
      // Reset form
      setAssetData({
        name: '',
        model: '',
        serialNumber: '',
        status: 'OPERATIONAL',
        location: '',
      });
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add asset. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Button 
                    variant="subtle" 
                    leftSection={<IconPlus size={16} />}
                    onClick={() => router.push('/maintenance/schedule')}
                    justify="flex-start"
                    style={{ textAlign: 'left' }}
                  >
                    Schedule Maintenance
                  </Button>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setAddAssetModalOpened(true)}
                    justify="flex-start"
                    style={{ textAlign: 'left' }}
                  >
                    Add New Asset
                  </Button>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconClipboardCheck size={16} />}
                    onClick={() => router.push('/reports/generate')}
                    justify="flex-start"
                    style={{ textAlign: 'left' }}
                  >
                    Generate Report
                  </Button>
                  <Button 
                    variant="subtle" 
                    leftSection={<IconTool size={16} />}
                    onClick={() => router.push('/tasks')}
                    justify="flex-start"
                    style={{ textAlign: 'left' }}
                  >
                    View Pending Tasks
                  </Button>
                </Stack>
              </Card>

              {/* Add Asset Modal */}
              <Modal
                opened={addAssetModalOpened}
                onClose={() => setAddAssetModalOpened(false)}
                title="Add New Asset"
                size="md"
              >
                <Stack gap="md">
                  <TextInput
                    label="Asset Name"
                    placeholder="Enter asset name"
                    value={assetData.name}
                    onChange={(e) => setAssetData({ ...assetData, name: e.target.value })}
                    required
                  />
                  <TextInput
                    label="Model"
                    placeholder="Enter model"
                    value={assetData.model}
                    onChange={(e) => setAssetData({ ...assetData, model: e.target.value })}
                  />
                  <TextInput
                    label="Serial Number"
                    placeholder="Enter serial number"
                    value={assetData.serialNumber}
                    onChange={(e) => setAssetData({ ...assetData, serialNumber: e.target.value })}
                    required
                  />
                  <Select
                    label="Status"
                    placeholder="Select status"
                    value={assetData.status}
                    onChange={(value) => setAssetData({ ...assetData, status: value || 'OPERATIONAL' })}
                    data={STATUS_OPTIONS}
                    required
                  />
                  <TextInput
                    label="Location"
                    placeholder="Enter location"
                    value={assetData.location}
                    onChange={(e) => setAssetData({ ...assetData, location: e.target.value })}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setAddAssetModalOpened(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddAsset}
                      loading={isSubmitting}
                      disabled={!assetData.name || !assetData.serialNumber}
                    >
                      Add Asset
                    </Button>
                  </Group>
                </Stack>
              </Modal>
            </Grid.Col>
          </Grid>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
