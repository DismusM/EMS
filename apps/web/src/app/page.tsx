'use client';

// Beginner note:
// This is the PUBLIC landing page at '/'.
// If the user is already logged in, we gently push them to '/dashboard'.
// If they are not logged in, we show a friendly hero section with buttons.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Group, List, rem, Stack, Text, Title } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export default function LandingPage() {
  const { authState } = useAuth();
  const router = useRouter();

  // If a logged-in user visits '/', send them to their dashboard.
  useEffect(() => {
    if (authState.isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [authState.isAuthenticated, router]);

  return (
    <Container size="lg" pt={80} pb={80}>
      {/* Big friendly title and short description */}
      <Stack gap="md">
        <Title order={1}>Equipment Maintenance System</Title>
        <Text c="dimmed" size="lg">
          Keep track of your equipment, manage users and roles, and keep maintenance on schedule.
          This landing page is public – you can login or create an account to continue.
        </Text>
        {/* Feature bullets – simple and beginner-friendly */}
        <List spacing="xs" size="md" withPadding>
          <List.Item>Modern, clean dashboard (Mantine UI)</List.Item>
          <List.Item>Role-based access for Admin, Supervisor, Technician, Asset Manager, Client</List.Item>
          <List.Item>Asset management with cards and CRUD</List.Item>
        </List>
        {/* Call-to-action buttons */}
        <Group mt={rem(12)}>
          <Button component={Link} href="/login" size="md">Login</Button>
          <Button component={Link} href="/signup" size="md" variant="light">Create Account</Button>
        </Group>
      </Stack>
    </Container>
  );
}
