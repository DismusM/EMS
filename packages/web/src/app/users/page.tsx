'use client';

import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { CreateUserForm } from '@ems/user-management';
import { useAuth } from '../../hooks/useAuth';
import { Title, Alert } from '@mantine/core';

export default function UserManagementPage() {
  const { authState } = useAuth();

  // This is a simple client-side role check.
  // The AppLayout already hides the link, but this prevents direct access.
  const isAdmin = authState.user?.role.id === 'admin';

  if (!authState.token) {
    return null; // Should be handled by AuthGuard, but as a fallback.
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Title order={2}>User Management</Title>
        {isAdmin ? (
          <CreateUserForm token={authState.token} onUserCreated={() => {
            // In a real app, we might want to show a success message
            // or refresh a list of users.
            console.log('User created!');
          }} />
        ) : (
          <Alert color="red" title="Access Denied">
            You do not have permission to view this page.
          </Alert>
        )}
      </AppLayout>
    </AuthGuard>
  );
}
