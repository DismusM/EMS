'use client';

import React from 'react';
import { Asset, RoleId } from '@ems/shared';
import { Card, Text, Group, Badge, Button, SimpleGrid, Alert, Title } from '@mantine/core';
import { PageLayout } from '@ems/ui';

interface AssetCardsProps {
  assets: Asset[];
  canManage: boolean;
  onEdit: (asset: Asset) => void;
  onRetire: (asset: Asset) => void;
  onChangeStatus?: (asset: Asset, status: Asset['status']) => void;
  onViewActivity?: (asset: Asset) => void;
  onShowQr?: (asset: Asset) => void;
}

const StatusBadge = ({ status }: { status: Asset['status'] }) => {
  if (status === 'OPERATIONAL') return <Badge color="green">Active</Badge>;
  if (status === 'IN_REPAIR') return <Badge color="yellow">Under Maintenance</Badge>;
  if (status === 'DECOMMISSIONED') return <Badge color="gray">Retired</Badge>;
  return <Badge>{status}</Badge>;
};

export function AssetCards({ assets, canManage, onEdit, onRetire, onChangeStatus, onViewActivity, onShowQr }: AssetCardsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {assets.map((asset) => (
        <Card key={asset.id} withBorder shadow="sm" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>{asset.name}</Text>
            <StatusBadge status={asset.status} />
          </Group>
          <Text size="sm" c="dimmed">Model: {asset.model || '-'}</Text>
          <Text size="sm" c="dimmed">Serial: {asset.serialNumber}</Text>
          <Text size="sm" c="dimmed">Location: {asset.location || '-'}</Text>
          <Text size="sm" c="dimmed">Department: {(asset as any).department || '-'}</Text>
          <Text size="sm" c="dimmed">Building/Room: {[(asset as any).building, (asset as any).room].filter(Boolean).join(' / ') || '-'}</Text>
          <Text size="sm" c="dimmed">Custodian: {(asset as any).custodianName || '-'}</Text>
          <Group mt="md">
            {canManage && (
              <>
                <Button size="xs" onClick={() => onEdit(asset)}>Edit</Button>
                <Button size="xs" color="red" variant="light" onClick={() => onRetire(asset)}>Retire</Button>
                {onViewActivity && <Button size="xs" variant="light" onClick={() => onViewActivity(asset)}>Activity</Button>}
                {onShowQr && <Button size="xs" variant="light" onClick={() => onShowQr(asset)}>QR</Button>}
                {onChangeStatus && (
                  <>
                    <Button size="xs" variant="light" onClick={() => onChangeStatus(asset, 'OPERATIONAL')}>Mark Active</Button>
                    <Button size="xs" variant="light" color="yellow" onClick={() => onChangeStatus(asset, 'IN_REPAIR')}>Mark In Repair</Button>
                  </>
                )}
              </>
            )}
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
