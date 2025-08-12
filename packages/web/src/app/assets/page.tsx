'use client';

import { useState } from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { AssetList, AssetForm } from '@ems/equipment-asset-management';
import { useAuth } from '../../hooks/useAuth';
import { Asset } from '@ems/shared';

export default function AssetsPage() {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

  // A key to force re-fetching in the AssetList component after a successful form submission
  const [listVersion, setListVersion] = useState(0);

  const handleCreateAsset = () => {
    setAssetToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setAssetToEdit(asset);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setListVersion(v => v + 1); // Increment version to trigger re-fetch
  };

  if (!authState.token || !authState.user) {
    return null; // Or a loading state
  }

  return (
    <AuthGuard>
      <AppLayout>
        <AssetList
          key={listVersion} // Use key to force re-render and re-fetch
          token={authState.token}
          userRole={authState.user.role.id as any}
          onCreateAsset={handleCreateAsset}
          onEditAsset={handleEditAsset}
        />
        <AssetForm
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={authState.token}
          assetToEdit={assetToEdit}
          onFormSuccess={handleFormSuccess}
        />
      </AppLayout>
    </AuthGuard>
  );
}
