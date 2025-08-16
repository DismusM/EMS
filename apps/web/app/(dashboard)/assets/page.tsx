'use client';

// Beginner note:
// This is a placeholder for Clients to see assets assigned to them.
// Only Clients should see this link (role mapping in AppLayout).

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { 
  Title, 
  Card, 
  Group, 
  Stack, 
  Text, 
  Badge, 
  Button,
  Grid,
  Image,
  TextInput,
  Select
} from '@mantine/core';
import { IconSearch, IconEye, IconQrcode } from '@tabler/icons-react';
import Link from 'next/link';

interface Asset {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: 'active' | 'in-repair' | 'inactive';
  location: string;
  imageUrl?: string;
}

export default function AssetsPage() {
  const { authState } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // Mock assets data - in real app, fetch from API
    const mockAssets: Asset[] = [
      {
        id: '1',
        name: 'Industrial Generator G-100',
        model: 'PowerMax 5000',
        serial: 'PM5K-001',
        status: 'active',
        location: 'Main Power Room',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Generator',
      },
      {
        id: '2',
        name: 'HVAC Unit A-20',
        model: 'CoolBreeze 20X',
        serial: 'CB20X-045',
        status: 'in-repair',
        location: 'Rooftop Section A',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=HVAC',
      },
      {
        id: '3',
        name: 'Water Pump P-05',
        model: 'AquaFlow 300',
        serial: 'AF300-112',
        status: 'active',
        location: 'Basement Level 2',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Water+Pump',
      },
      {
        id: '4',
        name: 'Conveyor Belt System CB-003',
        model: 'FlowMax 2000',
        serial: 'FM2K-078',
        status: 'active',
        location: 'Production Floor A',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Conveyor',
      },
      {
        id: '5',
        name: 'Forklift FL-002',
        model: 'LiftPro 3500',
        serial: 'LP35-234',
        status: 'in-repair',
        location: 'Warehouse Section B',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Forklift',
      },
      {
        id: '6',
        name: 'Air Compressor AC-015',
        model: 'CompressMax 500',
        serial: 'CM500-089',
        status: 'active',
        location: 'Utility Room C',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Compressor',
      },
    ];

    setAssets(mockAssets);
    setLoading(false);
  }, []);

  if (!authState.token) return null;

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusColor = {
    active: 'green',
    'in-repair': 'yellow',
    inactive: 'gray'
  };

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Assets</Title>
            <Button>Add New Asset</Button>
          </Group>

          <Group>
            <TextInput
              placeholder="Search assets..."
              leftSection={<IconSearch size="1rem" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'in-repair', label: 'In Repair' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Group>

          {loading ? (
            <Text>Loading assets...</Text>
          ) : (
            <Grid>
              {filteredAssets.map((asset) => (
                <Grid.Col key={asset.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
                    {asset.imageUrl && (
                      <Image
                        src={asset.imageUrl}
                        alt={asset.name}
                        height={160}
                        radius="md"
                      />
                    )}
                    
                    <Stack gap="sm" style={{ flex: 1 }} mt="md">
                      <Group justify="space-between" align="flex-start">
                        <Text fw={600} lineClamp={2}>{asset.name}</Text>
                        <Badge color={statusColor[asset.status]} size="sm">
                          {asset.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </Group>
                      
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">
                          <strong>Model:</strong> {asset.model}
                        </Text>
                        <Text size="sm" c="dimmed">
                          <strong>Serial:</strong> {asset.serial}
                        </Text>
                        <Text size="sm" c="dimmed">
                          <strong>Location:</strong> {asset.location}
                        </Text>
                      </Stack>
                      
                      <Group mt="auto" pt="md">
                        <Button
                          component={Link}
                          href={`/assets/${asset.id}`}
                          variant="light"
                          leftSection={<IconEye size="1rem" />}
                          flex={1}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          p="xs"
                        >
                          <IconQrcode size="1rem" />
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}

          {filteredAssets.length === 0 && !loading && (
            <Text ta="center" c="dimmed" py="xl">
              No assets found matching your criteria.
            </Text>
          )}
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
