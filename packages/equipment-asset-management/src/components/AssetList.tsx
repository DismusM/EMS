'use client';

import React, { useEffect, useState } from 'react';
import { Asset, RoleId } from '@ems/shared';
import { getAssets, deleteAsset, patchAssetStatus } from '../api/apiClient';
import { Table, Button, Group, Alert, Title, TextInput, Select, Badge, Stack, SegmentedControl } from '@mantine/core';
import { PageLayout } from '@ems/ui';
import { AssetCards } from './AssetCards';
import { AssetActivityDrawer } from './AssetActivityDrawer';
import { QrCodeModal } from './QrCodeModal';
import { QrScannerModal } from './QrScannerModal';

interface AssetListProps {
  token: string;
  // In a real app, role would be derived from the token/auth context
  userRole: RoleId;
  onEditAsset: (asset: Asset) => void;
  onCreateAsset: () => void;
}

export const AssetList = ({ token, userRole, onEditAsset, onCreateAsset }: AssetListProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [custodianFilter, setCustodianFilter] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [activityOpen, setActivityOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const fetchAssets = async () => {
    try {
      const data = await getAssets(token, {
        status: statusFilter || undefined,
        q: search || undefined,
        location: locationFilter || undefined,
        department: departmentFilter || undefined,
        custodianName: custodianFilter || undefined,
      });
      setAssets(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssets();
    }
  }, [token, statusFilter, locationFilter, departmentFilter, custodianFilter, search]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
        try {
            await deleteAsset(id, token);
            fetchAssets(); // Refresh list
        } catch (err: any) {
            setError(err.message);
        }
    }
  };

  const canManage = userRole === 'admin' || userRole === 'asset_manager';

  const statusBadge = (status: Asset['status']) => {
    if (status === 'OPERATIONAL') return <Badge color="green">Active</Badge>;
    if (status === 'IN_REPAIR') return <Badge color="yellow">Under Maintenance</Badge>;
    if (status === 'DECOMMISSIONED') return <Badge color="gray">Retired</Badge>;
    return <Badge>{status}</Badge>;
  };

  const rows = assets.map((asset) => (
    <Table.Tr key={asset.id}>
      <Table.Td>{asset.name}</Table.Td>
      <Table.Td>{statusBadge(asset.status)}</Table.Td>
      <Table.Td>{asset.model}</Table.Td>
      <Table.Td>{asset.serialNumber}</Table.Td>
      <Table.Td>{asset.location}</Table.Td>
      <Table.Td>{(asset as any).department || ''}</Table.Td>
      <Table.Td>{[(asset as any).building, (asset as any).room].filter(Boolean).join(' / ')}</Table.Td>
      <Table.Td>{(asset as any).custodianName || ''}</Table.Td>
      {canManage && (
        <Table.Td>
          <Group>
            <Button size="xs" onClick={() => onEditAsset(asset)}>Edit</Button>
            <Button size="xs" color="red" onClick={() => handleDelete(asset.id)}>Retire</Button>
            <Button size="xs" variant="light" onClick={async () => { await patchAssetStatus(asset.id, 'OPERATIONAL', token); fetchAssets(); }}>Mark Active</Button>
            <Button size="xs" variant="light" color="yellow" onClick={async () => { await patchAssetStatus(asset.id, 'IN_REPAIR', token); fetchAssets(); }}>Mark In Repair</Button>
            <Button size="xs" variant="light" onClick={() => { setSelected(asset); setActivityOpen(true); }}>Activity</Button>
            <Button size="xs" variant="light" onClick={() => { setSelected(asset); setQrOpen(true); }}>QR</Button>
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <PageLayout>
      <Group justify="space-between" mb="md">
        <Title order={2}>Equipment Assets</Title>
        <Group>
          {canManage && <Button onClick={onCreateAsset}>Register New Asset</Button>}
          <Button variant="light" onClick={() => setScannerOpen(true)}>Scan QR</Button>
        </Group>
      </Group>
      <Stack gap="xs" mb="sm">
        <Group>
          <SegmentedControl
            data={[{ label: 'Table', value: 'table' }, { label: 'Cards', value: 'cards' }]}
            value={view}
            onChange={(v) => setView(v as 'table' | 'cards')}
          />
          <Select
            placeholder="Filter status"
            data={[
              { value: 'OPERATIONAL', label: 'Active' },
              { value: 'IN_REPAIR', label: 'Under Maintenance' },
              { value: 'DECOMMISSIONED', label: 'Retired' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
          />
          <TextInput placeholder="Filter by location" value={locationFilter ?? ''} onChange={(e) => setLocationFilter(e.currentTarget.value || null)} />
          <TextInput placeholder="Filter by department" value={departmentFilter ?? ''} onChange={(e) => setDepartmentFilter(e.currentTarget.value || null)} />
          <TextInput placeholder="Filter by custodian" value={custodianFilter ?? ''} onChange={(e) => setCustodianFilter(e.currentTarget.value || null)} />
          <TextInput placeholder="Search name, model, serial, location, department, custodian" value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
          <Button variant="light" onClick={fetchAssets}>Refresh</Button>
        </Group>
      </Stack>
      {error && <Alert color="red" title="Error">{error}</Alert>}
      {view === 'table' ? (
      <Table withTableBorder withColumnBorders striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Model</Table.Th>
            <Table.Th>Serial Number</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Building/Room</Table.Th>
            <Table.Th>Custodian</Table.Th>
            {canManage && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      ) : (
        <AssetCards
          assets={assets}
          canManage={canManage}
          onEdit={onEditAsset}
          onRetire={(a) => handleDelete(a.id)}
          onChangeStatus={async (a, s) => { await patchAssetStatus(a.id, s, token); fetchAssets(); }}
          onViewActivity={(a) => { setSelected(a); setActivityOpen(true); }}
          onShowQr={(a) => { setSelected(a); setQrOpen(true); }}
        />
      )}
      <AssetActivityDrawer opened={activityOpen} onClose={() => setActivityOpen(false)} token={token} asset={selected} />
      <QrCodeModal opened={qrOpen} onClose={() => setQrOpen(false)} assetId={selected?.id || null} />
      <QrScannerModal
        opened={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={(raw) => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.t === 'asset' && parsed.id) {
              const found = assets.find(a => a.id === parsed.id);
              if (found) {
                setSelected(found);
                setQrOpen(true);
              } else {
                alert('Asset not found in current list. Try clearing filters.');
              }
            } else {
              alert('Unrecognized QR payload');
            }
          } catch {
            alert('Invalid QR content');
          } finally {
            setScannerOpen(false);
          }
        }}
      />
    </PageLayout>
  );
}
;
