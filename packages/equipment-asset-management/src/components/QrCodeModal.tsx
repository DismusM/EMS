"use client";

import React, { useEffect, useState } from 'react';
import { Modal, Image, Group, Loader, Alert, Text } from '@mantine/core';

// Asset QR content builder - encode asset id for detail route
function buildQrPayload(assetId: string) {
  return JSON.stringify({ t: 'asset', id: assetId });
}

interface QrCodeModalProps {
  opened: boolean;
  onClose: () => void;
  assetId: string | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ opened, onClose, assetId }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gen = async () => {
      if (!opened || !assetId) return;
      setError(null);
      setDataUrl(null);
      try {
        // Lazy import qrcode to keep bundle lean
        // @ts-ignore
        const QR = await import('qrcode');
        const payload = buildQrPayload(assetId);
        const url = await QR.toDataURL(payload, { width: 256, margin: 2 });
        setDataUrl(url);
      } catch (e: any) {
        setError(e.message || 'Failed to generate QR');
      }
    };
    gen();
  }, [opened, assetId]);

  return (
    <Modal opened={opened} onClose={onClose} title="Asset QR Code">
      {error && <Alert color="red" title="Error">{error}</Alert>}
      {!dataUrl ? (
        <Group justify="center" p="md"><Loader /></Group>
      ) : (
        <Group justify="center">
          <Image src={dataUrl} alt="QR code" w={256} h={256} radius="md" />
        </Group>
      )}
      <Text ta="center" mt="sm" c="dimmed">Scan to view this asset</Text>
    </Modal>
  );
};
