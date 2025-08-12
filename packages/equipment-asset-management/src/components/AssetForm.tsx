'use client';

import React, { useState, useEffect } from 'react';
import { Asset } from '@ems/shared';
import { Input, Button } from '@ems/ui';
import { Modal, Stack, Title, Alert, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { createAsset, updateAsset } from '../api/apiClient';

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

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = assetToEdit != null;

  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name);
      setModel(assetToEdit.model || '');
      setSerialNumber(assetToEdit.serialNumber);
      setLocation(assetToEdit.location || '');
      setStatus(assetToEdit.status);
      setPurchaseDate(assetToEdit.purchaseDate ? new Date(assetToEdit.purchaseDate) : null);
    } else {
      // Reset form when there's no asset to edit (Create mode)
      setName('');
      setModel('');
      setSerialNumber('');
      setLocation('');
      setStatus('OPERATIONAL');
      setPurchaseDate(null);
    }
  }, [assetToEdit, opened]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedStatus: Asset['status'] = status ?? 'OPERATIONAL';
    const assetData = { name, model, serialNumber, location, status: normalizedStatus, purchaseDate: purchaseDate?.toISOString() };

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
          <Input label="Asset Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required disabled={loading} />
          <Input label="Model" value={model} onChange={(e) => setModel(e.currentTarget.value)} disabled={loading} />
          <Input label="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.currentTarget.value)} required disabled={isEditMode || loading} />
          <Input label="Location" value={location} onChange={(e) => setLocation(e.currentTarget.value)} disabled={loading} />
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
            onChange={setPurchaseDate}
            disabled={loading}
          />
          <Button type="submit" loading={loading}>{isEditMode ? 'Save Changes' : 'Create Asset'}</Button>
        </Stack>
      </form>
    </Modal>
  );
};
