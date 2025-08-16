'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayout } from '@/components/AppLayout';
import { AssetList, AssetForm } from '@ems/equipment-asset-management';
import { useAuth } from '@/hooks/useAuth';
import { Title, Modal } from '@mantine/core';
import type { Asset } from '@ems/shared';

export default function AssetsPage() {
  const [formOpened, setFormOpened] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { authState } = useAuth();

  if (!authState.token) return null;

  const handleEditAsset = (asset: Asset) => {
    setAssetToEdit(asset);
    setFormOpened(true);
  };

  const handleCreateAsset = () => {
    setAssetToEdit(null);
    setFormOpened(true);
  };

  const handleFormSuccess = () => {
    setFormOpened(false);
    setAssetToEdit(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthGuard>
      <AppLayout>
        <Title order={2} mb="md">Equipment Assets</Title>
        
        <AssetList
          token={authState.token}
          userRole={authState.user?.role || 'CLIENT'}
          onEditAsset={handleEditAsset}
          onCreateAsset={handleCreateAsset}
          key={refreshKey}
        />

        <Modal 
          opened={formOpened} 
          onClose={() => setFormOpened(false)}
          title={assetToEdit ? 'Edit Asset' : 'Register New Asset'}
          size="lg"
        >
          <AssetForm
            opened={formOpened}
            onClose={() => setFormOpened(false)}
            token={authState.token}
            onFormSuccess={handleFormSuccess}
            assetToEdit={assetToEdit}
          />
        </Modal>
      </AppLayout>
    </AuthGuard>
  );
}
