'use client';

// Beginner note:
// This is a placeholder for Clients to see assets assigned to them.
// Only Clients should see this link (role mapping in AppLayout).

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
  Grid,
  Image,
  TextInput,
  Select,
  Modal,
  ActionIcon,
  Container,
  Loader,
  Center
} from '@mantine/core';
import { IconSearch, IconEye, IconQrcode, IconGridDots, IconList, IconDownload, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import QRCode from 'qrcode';

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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [qrModalOpened, setQrModalOpened] = useState(false);
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<Asset | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [newAsset, setNewAsset] = useState({
    name: '',
    model: '',
    serial: '',
    location: '',
    status: 'active' as Asset['status']
  });
  const [editAsset, setEditAsset] = useState({
    name: '',
    model: '',
    serial: '',
    location: '',
    status: 'active' as Asset['status']
  });

  // Fetch assets from API
  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        // Fallback to mock data if API fails
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
        ];
        setAssets(mockAssets);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      // Fallback to empty array or mock data
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.token) {
      fetchAssets();
    }
  }, [authState.token]);

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

  const handleEditAsset = (asset: Asset) => {
    setSelectedAssetForEdit(asset);
    setEditAsset({
      name: asset.name,
      model: asset.model,
      serial: asset.serial,
      location: asset.location,
      status: asset.status
    });
    setEditModalOpened(true);
  };

  const handleUpdateAsset = async () => {
    if (!selectedAssetForEdit) return;
    
    try {
      const response = await fetch(`/api/assets/${selectedAssetForEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          name: editAsset.name,
          model: editAsset.model,
          serial_number: editAsset.serial,
          location: editAsset.location,
          status: editAsset.status.toUpperCase()
        }),
      });

      if (response.ok) {
        // Update local state
        setAssets(assets.map(asset => 
          asset.id === selectedAssetForEdit.id 
            ? { ...asset, ...editAsset }
            : asset
        ));
        setEditModalOpened(false);
        setSelectedAssetForEdit(null);
      } else {
        console.error('Failed to update asset');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const handleAddAsset = async () => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          name: newAsset.name,
          model: newAsset.model,
          serial_number: newAsset.serial,
          location: newAsset.location,
          status: newAsset.status.toUpperCase()
        }),
      });

      if (response.ok) {
        const createdAsset = await response.json();
        setAssets([...assets, createdAsset]);
        setAddModalOpened(false);
        setNewAsset({ name: '', model: '', serial: '', location: '', status: 'active' });
      } else {
        console.error('Failed to add asset');
        // Fallback to local state update
        const newId = (assets.length + 1).toString();
        const assetToAdd: Asset = {
          id: newId,
          name: newAsset.name,
          model: newAsset.model,
          serial: newAsset.serial,
          status: newAsset.status,
          location: newAsset.location,
          imageUrl: '/api/placeholder/300/200'
        };
        setAssets([...assets, assetToAdd]);
        setAddModalOpened(false);
        setNewAsset({ name: '', model: '', serial: '', location: '', status: 'active' });
      }
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const generateQRCode = async (asset: Asset) => {
    try {
      const assetData = {
        id: asset.id,
        name: asset.name,
        serial: asset.serial,
        url: `${window.location.origin}/assets/${asset.id}`
      };
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(assetData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1E88E5',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
      setSelectedAssetForQR(asset);
      setQrModalOpened(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl && selectedAssetForQR) {
      const link = document.createElement('a');
      link.download = `${selectedAssetForQR.name.replace(/\s+/g, '_')}_QR.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Assets</Title>
            <Group>
              <Group gap="xs">
                <ActionIcon
                  variant={viewMode === 'card' ? 'filled' : 'subtle'}
                  color="#1e88e5"
                  onClick={() => setViewMode('card')}
                >
                  <IconGridDots size="1rem" />
                </ActionIcon>
                <ActionIcon
                  variant={viewMode === 'table' ? 'filled' : 'subtle'}
                  color="#1e88e5"
                  onClick={() => setViewMode('table')}
                >
                  <IconList size="1rem" />
                </ActionIcon>
              </Group>
              <Button 
                variant="filled" 
                color="#1e88e5"
                onClick={() => setAddModalOpened(true)}
              >
                Add New Asset
              </Button>
            </Group>
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
            <Center h={200}>
              <Loader size="lg" />
            </Center>
          ) : viewMode === 'card' ? (
            <Grid>
              {filteredAssets.map((asset) => (
                <Grid.Col key={asset.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <Card withBorder shadow="sm" padding="lg" radius="md">
                    <Card.Section>
                      <Image
                        src={asset.imageUrl}
                        height={160}
                        alt={asset.name}
                        fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEyNSA3NUgxNzVMMTUwIDEwMFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+"
                      />
                    </Card.Section>

                    <Stack gap="sm" mt="md">
                      <Group justify="space-between">
                        <Text fw={500} size="lg">{asset.name}</Text>
                        <Badge color={statusColor[asset.status]} variant="light">
                          {asset.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {asset.model}
                      </Text>

                      <Text size="sm">
                        <strong>Serial:</strong> {asset.serial}
                      </Text>

                      <Text size="sm">
                        <strong>Location:</strong> {asset.location}
                      </Text>

                      <Group gap="xs" mt="md">
                        <Button
                          component={Link}
                          href={`/assets/${asset.id}`}
                          variant="light"
                          color="#1e88e5"
                          size="sm"
                          leftSection={<IconEye size="1rem" />}
                          style={{ flex: 1 }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          color="#1e88e5"
                          size="sm"
                          leftSection={<IconQrcode size="1rem" />}
                          onClick={() => generateQRCode(asset)}
                        >
                          QR
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Card withBorder>
              <Stack gap="xs">
                <Group p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
                  <Text fw={600} style={{ flex: 1 }}>Name</Text>
                  <Text fw={600} w={120}>Status</Text>
                  <Text fw={600} w={150}>Location</Text>
                  <Text fw={600} w={100}>Actions</Text>
                </Group>
                {filteredAssets.map((asset) => (
                  <Group key={asset.id} p="md" style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={500}>{asset.name}</Text>
                      <Text size="sm" c="dimmed">{asset.model} • {asset.serial}</Text>
                    </Stack>
                    <Badge color={statusColor[asset.status]} variant="light" w={120}>
                      {asset.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Text size="sm" w={150}>{asset.location}</Text>
                    <Group gap="xs" w={100}>
                      <ActionIcon
                        component={Link}
                        href={`/assets/${asset.id}`}
                        variant="light"
                        color="#1e88e5"
                        size="sm"
                      >
                        <IconEye size="1rem" />
                      </ActionIcon>
                      <ActionIcon
                        variant="outline"
                        color="#1e88e5"
                        size="sm"
                        onClick={() => generateQRCode(asset)}
                      >
                        <IconQrcode size="1rem" />
                      </ActionIcon>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {filteredAssets.length === 0 && !loading && (
            <Text ta="center" c="dimmed" py="xl">
              No assets found matching your criteria.
            </Text>
          )}
          <Modal
            opened={addModalOpened}
            onClose={() => {
              setAddModalOpened(false);
              setNewAsset({ name: '', model: '', serial: '', location: '', status: 'active' });
            }}
            title="Add New Asset"
            size="md"
            centered
          >
            <Stack gap="md">
              <TextInput
                label="Asset Name"
                placeholder="Enter asset name"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                required
              />
              
              <TextInput
                label="Model"
                placeholder="Enter model"
                value={newAsset.model}
                onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
              />
              
              <TextInput
                label="Serial Number"
                placeholder="Enter serial number"
                value={newAsset.serial}
                onChange={(e) => setNewAsset({ ...newAsset, serial: e.target.value })}
              />
              
              <TextInput
                label="Location"
                placeholder="Enter location"
                value={newAsset.location}
                onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                required
              />
              
              <Select
                label="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'in-repair', label: 'In Repair' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                value={newAsset.status}
                onChange={(value) => setNewAsset({ ...newAsset, status: value as Asset['status'] })}
              />
              
              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddModalOpened(false);
                    setNewAsset({ name: '', model: '', serial: '', location: '', status: 'active' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="#1e88e5"
                  onClick={handleAddAsset}
                  disabled={!newAsset.name || !newAsset.location}
                >
                  Add Asset
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* Edit Asset Modal */}
          <Modal
            opened={editModalOpened}
            onClose={() => {
              setEditModalOpened(false);
              setSelectedAssetForEdit(null);
            }}
            title="Edit Asset"
            size="md"
          >
            <Stack gap="md">
              <TextInput
                label="Asset Name"
                placeholder="Enter asset name"
                value={editAsset.name}
                onChange={(e) => setEditAsset({ ...editAsset, name: e.target.value })}
                required
              />
              <TextInput
                label="Model"
                placeholder="Enter model"
                value={editAsset.model}
                onChange={(e) => setEditAsset({ ...editAsset, model: e.target.value })}
              />
              <TextInput
                label="Serial Number"
                placeholder="Enter serial number"
                value={editAsset.serial}
                onChange={(e) => setEditAsset({ ...editAsset, serial: e.target.value })}
                required
              />
              <TextInput
                label="Location"
                placeholder="Enter location"
                value={editAsset.location}
                onChange={(e) => setEditAsset({ ...editAsset, location: e.target.value })}
                required
              />
              <Select
                label="Status"
                placeholder="Select status"
                value={editAsset.status}
                onChange={(value) => setEditAsset({ ...editAsset, status: value as Asset['status'] })}
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'in-repair', label: 'In Repair' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                required
              />
              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditModalOpened(false);
                    setSelectedAssetForEdit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="#1e88e5"
                  onClick={handleUpdateAsset}
                  disabled={!editAsset.name || !editAsset.location}
                >
                  Update Asset
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* QR Code Modal */}
          <Modal
            opened={qrModalOpened}
            onClose={() => {
              setQrModalOpened(false);
              setSelectedAssetForQR(null);
              setQrCodeDataUrl('');
            }}
            title={`QR Code - ${selectedAssetForQR?.name}`}
            size="md"
            centered
          >
            <Stack gap="md" align="center">
              {qrCodeDataUrl && (
                <>
                  <Image
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    width={300}
                    height={300}
                    style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                  />
                  
                  <Stack gap="xs" align="center">
                    <Text size="sm" c="dimmed" ta="center">
                      Scan this QR code to view asset details
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      Asset ID: {selectedAssetForQR?.id} | Serial: {selectedAssetForQR?.serial}
                    </Text>
                  </Stack>
                  
                  <Group justify="center" mt="md">
                    <Button
                      variant="outline"
                      leftSection={<IconDownload size="1rem" />}
                      onClick={downloadQRCode}
                    >
                      Download QR Code
                    </Button>
                    <Button
                      color="#1e88e5"
                      onClick={() => {
                        setQrModalOpened(false);
                        setSelectedAssetForQR(null);
                        setQrCodeDataUrl('');
                      }}
                    >
                      Close
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Modal>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
