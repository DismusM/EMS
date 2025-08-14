'use client';

// Beginner note:
// This is the DASHBOARD page shown to logged-in users at '/dashboard'.
// If someone is NOT logged in, our AuthGuard will gently send them back to '/'.
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { Title, Text, Stack, Badge } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
  const { authState } = useAuth();

  return (
    <AuthGuard redirectTo="/">
      <AppLayout>
        <Stack>
          <Title order={2}>Dashboard</Title>
          <Text>
            Welcome{authState.user ? `, ${authState.user.name}` : ''}! This is your home base where
            you can find links to everything you need.
          </Text>
          <Text>
            Your role is: <Badge>{authState.user?.role.name}</Badge>
          </Text>
          <Text c="dimmed" size="sm">
            Beginner tip: The left sidebar changes based on your role. Try switching users later to
            see how the menu updates.
          </Text>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
