'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayout } from '@/components/AppLayout';
import { CreateUserForm, PendingUsersTable, UsersTable } from '@ems/user-management';
import { useAuth } from '@/hooks/useAuth';
import { Title, Alert, Button, Modal, Group } from '@mantine/core';

export default function UserManagementPage() {
  const [opened, setOpened] = useState(false);
  const [listVersion, setListVersion] = useState(0);
  const { authState } = useAuth();

  // This is a simple client-side role check.
  // The AppLayout already hides the link, but this prevents direct access.
  const isAdmin = authState.user?.role === 'ADMIN';

  if (!authState.token) {
    return null; // Should be handled by AuthGuard, but as a fallback.
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Title order={2}>User Management</Title>
        {isAdmin ? (
          <>
            <Group justify="space-between" mb="md">
              <div />
              <Button onClick={() => setOpened(true)}>New User</Button>
            </Group>

            <Modal opened={opened} onClose={() => setOpened(false)} title="Create New User" centered>
              <CreateUserForm
                token={authState.token}
                onUserCreated={() => {
                  setOpened(false);
                  setListVersion(v => v + 1);
                }}
              />
            </Modal>
            <PendingUsersTable token={authState.token} refreshKey={listVersion} />
            <div style={{ height: 16 }} />
            <UsersTable
              token={authState.token}
              currentUserId={authState.user!.id}
              refreshKey={listVersion}
              onChanged={() => setListVersion(v => v + 1)}
            />
          </>
        ) : (
          <Alert color="red" title="Access Denied">
            You do not have permission to view this page.
          </Alert>
        )}
      </AppLayout>
    </AuthGuard>
  );
}
