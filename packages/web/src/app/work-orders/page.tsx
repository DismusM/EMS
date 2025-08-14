'use client';

// Beginner note:
// This is a placeholder Work Orders page. In Phase 3+, we'll add real content.
// Only Admin and Supervisor should see this link (handled by sidebar role map),
// and accessing directly requires login (AuthGuard) which will redirect to '/' if not logged in.
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { Title, Text, Stack } from '@mantine/core';

export default function WorkOrdersPage() {
  return (
    <AuthGuard redirectTo="/">
      <AppLayout>
        <Stack>
          <Title order={2}>Work Orders</Title>
          <Text c="dimmed">Coming soon: create, assign, and track work orders.</Text>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
