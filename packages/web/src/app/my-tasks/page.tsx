'use client';

// Beginner note:
// This is a placeholder My Tasks page for Technicians.
// Only Technicians should see this link in the sidebar (role mapping in AppLayout).
// If a user is not logged in and opens this page directly, AuthGuard sends them to '/'.
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { Title, Text, Stack } from '@mantine/core';

export default function MyTasksPage() {
  return (
    <AuthGuard redirectTo="/">
      <AppLayout>
        <Stack>
          <Title order={2}>My Tasks</Title>
          <Text c="dimmed">Coming soon: tasks assigned to you, with progress tracking.</Text>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
