"use client";

import React, { useEffect, useState } from 'react';
import { Drawer, Table, Group, Title, Text, Badge, Loader, Alert, ScrollArea } from '@mantine/core';
import { Asset } from '@ems/shared';
import { getAssetActivity } from '../api/apiClient';

interface AssetActivityDrawerProps {
  opened: boolean;
  onClose: () => void;
  token: string;
  asset: Asset | null;
}

interface ActivityRow {
  id: string;
  assetId: string;
  action: string;
  actorUserId?: string | null;
  beforeJson?: string | null;
  afterJson?: string | null;
  createdAt: string | number | Date;
}

export const AssetActivityDrawer: React.FC<AssetActivityDrawerProps> = ({ opened, onClose, token, asset }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ActivityRow[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!opened || !asset) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getAssetActivity(asset.id, token);
        setRows(data || []);
      } catch (e: any) {
        setError(e.message || 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [opened, asset?.id, token]);

  const renderStatus = (action: string) => {
    if (action === 'CREATED') return <Badge color="green">Created</Badge>;
    if (action === 'UPDATED') return <Badge color="blue">Updated</Badge>;
    if (action === 'STATUS_CHANGED') return <Badge color="yellow">Status</Badge>;
    if (action === 'ASSIGNED') return <Badge color="grape">Assigned</Badge>;
    if (action === 'RETIRED') return <Badge color="gray">Retired</Badge>;
    return <Badge>{action}</Badge>;
  };

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="xl" title={<Title order={4}>Asset Activity{asset ? ` — ${asset.name}` : ''}</Title>}>
      {error && <Alert color="red" title="Error">{error}</Alert>}
      {loading ? (
        <Group justify="center" p="md"><Loader /></Group>
      ) : (
        <ScrollArea h={500}>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>When</Table.Th>
                <Table.Th>Action</Table.Th>
                <Table.Th>Actor</Table.Th>
                <Table.Th>Before</Table.Th>
                <Table.Th>After</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length === 0 ? (
                <Table.Tr><Table.Td colSpan={5}><Text c="dimmed">No activity yet.</Text></Table.Td></Table.Tr>
              ) : rows.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{new Date(r.createdAt as any).toLocaleString()}</Table.Td>
                  <Table.Td>{renderStatus(r.action)}</Table.Td>
                  <Table.Td><Text size="sm">{r.actorUserId || '-'}</Text></Table.Td>
                  <Table.Td><Text size="xs" c="dimmed" style={{ wordBreak: 'break-word' }}>{r.beforeJson || '-'}</Text></Table.Td>
                  <Table.Td><Text size="xs" c="dimmed" style={{ wordBreak: 'break-word' }}>{r.afterJson || '-'}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Drawer>
  );
};
