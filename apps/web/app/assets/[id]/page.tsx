'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '../../../components/AuthGuard';
import { AppLayout } from '../../../components/AppLayout';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Title, 
  Card, 
  Group, 
  Stack, 
  Text, 
  Badge, 
  Button,
  Image,
  Divider,
  Grid,
  Alert,
  ActionIcon
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconQrcode, 
  IconMapPin, 
  IconCalendar,
  IconTool,
  IconUser,
  IconFileText
} from '@tabler/icons-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Asset {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: 'active' | 'in-repair' | 'inactive';
  location: string;
  category: string;
  description: string;
  purchaseDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTo?: string;
  imageUrl?: string;
}

export default function AssetDetailsPage() {
  const { authState } = useAuth();
  const params = useParams();
  const assetId = params.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock asset data - in real app, fetch from API using assetId
    const mockAssets: Record<string, Asset> = {
      '1': {
        id: '1',
        name: 'Industrial Generator G-100',
        model: 'PowerMax 5000',
        serial: 'PM5000-2024-001',
        status: 'active',
        location: 'Building A - Basement',
        category: 'Power Equipment',
        description: 'Primary backup generator for Building A. Provides emergency power during outages.',
        purchaseDate: '2024-01-15',
        lastMaintenance: '2024-02-15',
        nextMaintenance: '2024-05-15',
        assignedTo: 'John Smith',
        imageUrl: '/api/placeholder/400/300'
      },
      '2': {
        id: '2',
        name: 'HVAC Unit A-20',
        model: 'CoolAir Pro 3000',
        serial: 'CA3000-2023-045',
        status: 'in-repair',
        location: 'Building A - Roof',
        category: 'Climate Control',
        description: 'Main HVAC unit for Building A floors 1-5. Currently undergoing maintenance.',
        purchaseDate: '2023-06-10',
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-04-20',
        assignedTo: 'Sarah Johnson',
        imageUrl: '/api/placeholder/400/300'
      }
    };

    const foundAsset = mockAssets[assetId];
    setAsset(foundAsset || null);
    setLoading(false);
  }, [assetId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'in-repair': return 'yellow';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  if (!authState.token) return null;

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <Text>Loading asset details...</Text>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (!asset) {
    return (
      <AuthGuard>
        <AppLayout>
          <Stack gap="lg">
            <Group>
              <ActionIcon 
                component={Link} 
                href="/assets" 
                variant="subtle" 
                size="lg"
              >
                <IconArrowLeft size="1.2rem" />
              </ActionIcon>
              <Title order={2}>Asset Not Found</Title>
            </Group>
            <Alert color="red" title="Asset Not Found">
              The requested asset could not be found. It may have been deleted or the ID is incorrect.
            </Alert>
          </Stack>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <ActionIcon 
                component={Link} 
                href="/assets" 
                variant="subtle" 
                size="lg"
              >
                <IconArrowLeft size="1.2rem" />
              </ActionIcon>
              <Title order={2}>{asset.name}</Title>
            </Group>
            <Group>
              <Button 
                leftSection={<IconQrcode size="1rem" />}
                variant="outline"
                color="#1e88e5"
              >
                Generate QR
              </Button>
              <Button 
                leftSection={<IconEdit size="1rem" />}
                color="#1e88e5"
              >
                Edit Asset
              </Button>
            </Group>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder padding="lg">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="xl" fw={600}>{asset.name}</Text>
                    <Badge color={getStatusColor(asset.status)} size="lg">
                      {asset.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Image
                    src={asset.imageUrl}
                    height={300}
                    alt={asset.name}
                    radius="md"
                    fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5Bc3NldCBJbWFnZTwvdGV4dD4KPC9zdmc+"
                  />

                  <Text c="dimmed">{asset.description}</Text>

                  <Divider />

                  <Grid>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconTool size="1rem" color="#1e88e5" />
                        <div>
                          <Text size="sm" c="dimmed">Model</Text>
                          <Text fw={500}>{asset.model}</Text>
                        </div>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconFileText size="1rem" color="#1e88e5" />
                        <div>
                          <Text size="sm" c="dimmed">Serial Number</Text>
                          <Text fw={500}>{asset.serial}</Text>
                        </div>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconMapPin size="1rem" color="#1e88e5" />
                        <div>
                          <Text size="sm" c="dimmed">Location</Text>
                          <Text fw={500}>{asset.location}</Text>
                        </div>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconUser size="1rem" color="#1e88e5" />
                        <div>
                          <Text size="sm" c="dimmed">Assigned To</Text>
                          <Text fw={500}>{asset.assignedTo || 'Unassigned'}</Text>
                        </div>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Card withBorder padding="lg">
                  <Stack gap="md">
                    <Text size="lg" fw={600}>Maintenance Schedule</Text>
                    
                    <Group gap="xs">
                      <IconCalendar size="1rem" color="#1e88e5" />
                      <div>
                        <Text size="sm" c="dimmed">Last Maintenance</Text>
                        <Text fw={500}>{asset.lastMaintenance}</Text>
                      </div>
                    </Group>

                    <Group gap="xs">
                      <IconCalendar size="1rem" color="#1e88e5" />
                      <div>
                        <Text size="sm" c="dimmed">Next Maintenance</Text>
                        <Text fw={500}>{asset.nextMaintenance}</Text>
                      </div>
                    </Group>

                    <Button variant="light" color="#1e88e5" fullWidth>
                      Schedule Maintenance
                    </Button>
                  </Stack>
                </Card>

                <Card withBorder padding="lg">
                  <Stack gap="md">
                    <Text size="lg" fw={600}>Asset Information</Text>
                    
                    <div>
                      <Text size="sm" c="dimmed">Category</Text>
                      <Text fw={500}>{asset.category}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Purchase Date</Text>
                      <Text fw={500}>{asset.purchaseDate}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Asset ID</Text>
                      <Text fw={500}>{asset.id}</Text>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
