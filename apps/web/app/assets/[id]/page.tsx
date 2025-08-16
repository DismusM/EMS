'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Badge,
  Button,
  Image,
  Grid,
  Divider,
  ActionIcon,
  Modal
} from '@mantine/core';
import { IconQrcode, IconEdit, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import QRCode from 'qrcode';

interface Asset {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: 'OPERATIONAL' | 'IN_REPAIR' | 'DECOMMISSIONED';
  location: string;
  imageUrl?: string;
  description?: string;
  manufacturer?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  maintenanceSchedule?: string;
  assignedTechnician?: string;
  cost?: number;
  category?: string;
}

export default function AssetDetailsPage() {
  const params = useParams();
  const { authState } = useAuth();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrModalOpened, setQrModalOpened] = useState(false);

  useEffect(() => {
    // Mock asset data - in real app, fetch from API
    const mockAsset: Asset = {
      id: params.id as string,
      name: 'Industrial Generator G-100',
      model: 'PowerMax 5000',
      serial: 'PM5K-001',
      status: 'OPERATIONAL',
      location: 'Main Power Room',
      imageUrl: 'https://via.placeholder.com/400x300.png?text=Generator',
      description: 'Primary backup power generator for facility operations',
      manufacturer: 'PowerMax Industries',
      purchaseDate: '2022-03-15',
      warrantyExpiry: '2025-03-15',
      maintenanceSchedule: 'Monthly',
      assignedTechnician: 'John Smith',
      cost: 25000.00,
      category: 'Power Systems',
    };

    setAsset(mockAsset);
    setLoading(false);

    // Generate QR code
    const assetUrl = `${window.location.origin}/assets/${params.id}`;
    QRCode.toDataURL(assetUrl)
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  }, [params.id]);

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
          <Text>Asset not found</Text>
        </AppLayout>
      </AuthGuard>
    );
  }

  const statusColor = {
    OPERATIONAL: 'green',
    IN_REPAIR: 'yellow',
    DECOMMISSIONED: 'gray'
  }[asset.status];

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <Button 
                component={Link} 
                href="/assets" 
                variant="subtle" 
                leftSection={<IconArrowLeft size="1rem" />}
              >
                Back to Assets
              </Button>
              <Title order={2}>{asset.name}</Title>
            </Group>
            <Group>
              <ActionIcon 
                variant="light" 
                size="lg"
                onClick={() => setQrModalOpened(true)}
              >
                <IconQrcode size="1.2rem" />
              </ActionIcon>
              <Button leftSection={<IconEdit size="1rem" />}>
                Edit Asset
              </Button>
            </Group>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card>
                <Stack gap="md">
                  {asset.imageUrl && (
                    <Image
                      src={asset.imageUrl}
                      alt={asset.name}
                      height={300}
                      radius="md"
                    />
                  )}
                  
                  <Group justify="space-between">
                    <Title order={3}>{asset.name}</Title>
                    <Badge color={statusColor} size="lg">
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </Group>

                  {asset.description && (
                    <Text c="dimmed">{asset.description}</Text>
                  )}

                  <Divider />

                  <Grid>
                    <Grid.Col span={6}>
                      <Text fw={500}>Model</Text>
                      <Text>{asset.model}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text fw={500}>Serial Number</Text>
                      <Text>{asset.serial}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text fw={500}>Location</Text>
                      <Text>{asset.location}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text fw={500}>Category</Text>
                      <Text>{asset.category || 'N/A'}</Text>
                    </Grid.Col>
                    {asset.manufacturer && (
                      <Grid.Col span={6}>
                        <Text fw={500}>Manufacturer</Text>
                        <Text>{asset.manufacturer}</Text>
                      </Grid.Col>
                    )}
                    {asset.assignedTechnician && (
                      <Grid.Col span={6}>
                        <Text fw={500}>Assigned Technician</Text>
                        <Text>{asset.assignedTechnician}</Text>
                      </Grid.Col>
                    )}
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Card>
                  <Title order={4} mb="md">Asset Information</Title>
                  <Stack gap="sm">
                    {asset.purchaseDate && (
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Purchase Date</Text>
                        <Text size="sm">{asset.purchaseDate}</Text>
                      </Group>
                    )}
                    {asset.warrantyExpiry && (
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Warranty Expires</Text>
                        <Text size="sm">{asset.warrantyExpiry}</Text>
                      </Group>
                    )}
                    {asset.maintenanceSchedule && (
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Maintenance</Text>
                        <Text size="sm">{asset.maintenanceSchedule}</Text>
                      </Group>
                    )}
                    {asset.cost && (
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Purchase Cost</Text>
                        <Text size="sm">${asset.cost.toLocaleString()}</Text>
                      </Group>
                    )}
                  </Stack>
                </Card>

                <Card>
                  <Title order={4} mb="md">Quick Actions</Title>
                  <Stack gap="xs">
                    <Button variant="light" fullWidth>
                      Schedule Maintenance
                    </Button>
                    <Button variant="light" fullWidth>
                      Update Status
                    </Button>
                    <Button variant="light" fullWidth>
                      View History
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>

        <Modal
          opened={qrModalOpened}
          onClose={() => setQrModalOpened(false)}
          title="Asset QR Code"
          centered
        >
          <Stack align="center" gap="md">
            {qrCodeUrl && (
              <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
            )}
            <Text size="sm" ta="center" c="dimmed">
              Scan this QR code to quickly access this asset's details
            </Text>
            <Button 
              onClick={() => {
                const link = document.createElement('a');
                link.download = `${asset.name}-qr-code.png`;
                link.href = qrCodeUrl;
                link.click();
              }}
            >
              Download QR Code
            </Button>
          </Stack>
        </Modal>
      </AppLayout>
    </AuthGuard>
  );
}
