'use client';

// Beginner note:
// This is a placeholder for Clients to see assets assigned to them.
// Only Clients should see this link (role mapping in AppLayout).
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { Title, Text, Stack } from '@mantine/core';

export default function MyAssetsPage() {
  return (
    <AuthGuard redirectTo="/">
      <AppLayout>
        <Stack>
          <Title order={2}>My Assets</Title>
          <Text c="dimmed">Coming soon: assets assigned to you, with status and documents.</Text>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
