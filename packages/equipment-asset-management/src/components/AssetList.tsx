'use client';

import React, { useEffect, useState } from 'react';
import { Asset, RoleId } from '@ems/shared';
import { getAssets, deleteAsset } from '../api/apiClient';
import { Table, Button, Group, Alert, Title } from '@mantine/core';
import { PageLayout } from '@ems/ui';

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

  const fetchAssets = async () => {
    try {
      const data = await getAssets(token);
      setAssets(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssets();
    }
  }, [token]);

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

  const rows = assets.map((asset) => (
    <Table.Tr key={asset.id}>
      <Table.Td>{asset.name}</Table.Td>
      <Table.Td>{asset.status}</Table.Td>
      <Table.Td>{asset.model}</Table.Td>
      <Table.Td>{asset.serialNumber}</Table.Td>
      <Table.Td>{asset.location}</Table.Td>
      {canManage && (
        <Table.Td>
          <Group>
            <Button size="xs" onClick={() => onEditAsset(asset)}>Edit</Button>
            <Button size="xs" color="red" onClick={() => handleDelete(asset.id)}>Delete</Button>
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <PageLayout>
      <Group justify="space-between" mb="md">
        <Title order={2}>Equipment Assets</Title>
        {canManage && <Button onClick={onCreateAsset}>Register New Asset</Button>}
      </Group>
      {error && <Alert color="red" title="Error">{error}</Alert>}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Model</Table.Th>
            <Table.Th>Serial Number</Table.Th>
            <Table.Th>Location</Table.Th>
            {canManage && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </PageLayout>
  );
};
