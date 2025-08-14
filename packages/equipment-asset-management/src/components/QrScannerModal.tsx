"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Modal, Group, Button, Alert, Text } from '@mantine/core';

interface QrScannerModalProps {
  opened: boolean;
  onClose: () => void;
  onResult: (payload: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ opened, onClose, onResult }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const zxingReaderRef = useRef<any>(null);

  useEffect(() => {
    const start = async () => {
      if (!opened) return;
      setError(null);
      try {
        // First try native BarcodeDetector
        // @ts-ignore
        const hasDetector = typeof window !== 'undefined' && (window as any).BarcodeDetector;
        if (hasDetector) {
          // @ts-ignore
          const BarcodeDetector = (window as any).BarcodeDetector;
          detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            (videoRef.current as any).srcObject = stream;
            await videoRef.current.play();
          }
          setRunning(true);
          const tick = async () => {
            if (!running || !videoRef.current || !detectorRef.current) return;
            try {
              const barcodes = await detectorRef.current.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const raw = barcodes[0].rawValue || '';
                onResult(raw);
                return;
              }
            } catch {}
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        // Fallback to @zxing/browser
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const codeReader = new BrowserQRCodeReader();
        zxingReaderRef.current = codeReader;
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          (videoRef.current as any).srcObject = stream;
          await videoRef.current.play();
        }
        setRunning(true);
        // Decode continuously from video element
        codeReader.decodeFromVideoElement(videoRef.current!, (result, err, controls) => {
          if (result) {
            onResult(result.getText());
            controls.stop();
          }
        });
      } catch (e: any) {
        setError(e.message || 'Failed to start camera');
      }
    };
    start();
    return () => {
      setRunning(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        try { (videoRef.current as any).srcObject = null; } catch {}
        videoRef.current.pause();
      }
      if (zxingReaderRef.current) {
        try { zxingReaderRef.current.reset(); } catch {}
        zxingReaderRef.current = null;
      }
    };
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title="Scan Asset QR">
      {error && <Alert color="red" title="Scanner unavailable">{error}</Alert>}
      <Group justify="center">
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: 360, borderRadius: 8 }} />
      </Group>
      <Text mt="xs" c="dimmed" ta="center">Point the camera at a QR code</Text>
      <Group justify="center" mt="md">
        <Button variant="light" onClick={onClose}>Close</Button>
      </Group>
    </Modal>
  );
};
