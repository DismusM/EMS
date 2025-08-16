'use client';

import React, { useState, useEffect } from 'react';
import { Asset } from '@ems/shared';
import { Input, Button } from '@ems/ui';
import { Modal, Stack, Title, Alert, Select, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { createAsset, updateAsset } from '../api/apiClient';
import { z } from 'zod';

interface AssetFormProps {
  opened: boolean;
  onClose: () => void;
  token: string;
  onFormSuccess: () => void;
  assetToEdit?: Asset | null;
}

export const AssetForm = ({ opened, onClose, token, onFormSuccess, assetToEdit }: AssetFormProps) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<Asset['status'] | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  const [department, setDepartment] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [custodianName, setCustodianName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const isEditMode = assetToEdit != null;

  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name);
      setModel(assetToEdit.model || '');
      setSerialNumber(assetToEdit.serialNumber || '');
      setLocation(assetToEdit.location || '');
      setStatus(assetToEdit.status);
      setPurchaseDate(assetToEdit.purchaseDate ? new Date(assetToEdit.purchaseDate) : null);
      setDepartment((assetToEdit as any).department || '');
      setBuilding((assetToEdit as any).building || '');
      setRoom((assetToEdit as any).room || '');
      setCustodianName((assetToEdit as any).custodianName || '');
    } else {
      // Reset form when there's no asset to edit (Create mode)
      setName('');
      setModel('');
      setSerialNumber('');
      setLocation('');
      setStatus('OPERATIONAL');
      setPurchaseDate(null);
      setDepartment('');
      setBuilding('');
      setRoom('');
      setCustodianName('');
    }
  }, [assetToEdit, opened]);

  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    model: z.string().optional(),
    serialNumber: z.string().min(1, 'Serial Number is required'),
    location: z.string().optional(),
    status: z.enum(['OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED']),
    purchaseDate: z.date().optional().nullable(),
    department: z.string().optional(),
    building: z.string().optional(),
    room: z.string().optional(),
    custodianName: z.string().optional(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setFieldErrors({});

    const normalizedStatus: Asset['status'] = status ?? 'OPERATIONAL';
    const values = { name, model, serialNumber, location, status: normalizedStatus, purchaseDate, department, building, room, custodianName };

    // Client-side validation
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || 'form';
        fe[key] = issue.message;
      }
      setFieldErrors(fe);
      setLoading(false);
      return;
    }

    const assetData = { ...parsed.data, purchaseDate: parsed.data.purchaseDate ? parsed.data.purchaseDate.toISOString() : undefined } as any;

    try {
      if (isEditMode) {
        await updateAsset(assetToEdit.id, assetData, token);
      } else {
        await createAsset(assetData as any, token);
      }
      onFormSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isEditMode ? 'Edit Asset' : 'Register New Asset'}>
      <form onSubmit={handleSubmit}>
        <Stack>
          {error && <Alert color="red" title="Error">{error}</Alert>}
          <Input label="Asset Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required disabled={loading} error={fieldErrors.name} />
          <Input label="Model" value={model} onChange={(e) => setModel(e.currentTarget.value)} disabled={loading} error={fieldErrors.model} />
          <Input label="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.currentTarget.value)} required disabled={isEditMode || loading} error={fieldErrors.serialNumber} />
          <Input label="Location" value={location} onChange={(e) => setLocation(e.currentTarget.value)} disabled={loading} error={fieldErrors.location} />
          <Input label="Department" value={department} onChange={(e) => setDepartment(e.currentTarget.value)} disabled={loading} error={fieldErrors.department} />
          <Group grow>
            <Input label="Building" value={building} onChange={(e) => setBuilding(e.currentTarget.value)} disabled={loading} error={fieldErrors.building} />
            <Input label="Room" value={room} onChange={(e) => setRoom(e.currentTarget.value)} disabled={loading} error={fieldErrors.room} />
          </Group>
          <Input label="Custodian (name)" value={custodianName} onChange={(e) => setCustodianName(e.currentTarget.value)} disabled={loading} error={fieldErrors.custodianName} />
          <Select
            label="Status"
            value={status}
            onChange={(value) => setStatus(value as Asset['status'])}
            data={['OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED']}
            required
            disabled={loading}
          />
          <DatePickerInput
            label="Purchase Date"
            value={purchaseDate}
            onChange={setPurchaseDate as any}
            disabled={loading}
            clearable
          />
          <Button type="submit" loading={loading}>{isEditMode ? 'Save Changes' : 'Create Asset'}</Button>
        </Stack>
      </form>
    </Modal>
  );
};
