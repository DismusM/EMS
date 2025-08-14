'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { AuthGuard } from '../../components/AuthGuard';
import { useAuth } from '../../hooks/useAuth';
import { Alert, Button, Card, Grid, Stack, Text, Title } from '@mantine/core';
import { Input } from '@ems/ui';
import { getCurrentUserProfile, updateCurrentUserProfile } from '@ems/user-management';
import type { User } from '@ems/shared';

export default function ProfilePage() {
  const { authState } = useAuth();

  if (!authState.token) return null; // fallback; AuthGuard handles redirects

  return (
    <AuthGuard>
      <AppLayout>
        <Title order={2}>My Profile</Title>
        <ProfileForm />
      </AppLayout>
    </AuthGuard>
  );
}

function ProfileForm() {
  const { authState, login } = useAuth();
  const [user, setUser] = useState<User | null>(authState.user);

  const [name, setName] = useState(authState.user?.name || '');
  const [email, setEmail] = useState(authState.user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Load latest profile when page mounts
    const load = async () => {
      try {
        const fresh = await getCurrentUserProfile(authState.token!);
        setUser(fresh);
        setName(fresh.name);
        setEmail(fresh.email);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, [authState.token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && !oldPassword) {
      setError('Please enter your current password to set a new password.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCurrentUserProfile(authState.token!, {
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
        oldPassword: password ? oldPassword : undefined,
      });
      setUser(updated);
      setSuccess('Profile updated successfully.');
      setOldPassword('');
      setPassword('');
      // Update in-memory auth state so UI reflects new name/email
      login(authState.token!, updated);
    } catch (e: any) {
      setError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card withBorder padding="lg" mt="md">
      <form onSubmit={onSubmit}>
        <Stack>
          {error && <Alert color="red" title="Error">{error}</Alert>}
          {success && <Alert color="green" title="Success">{success}</Alert>}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required disabled={saving} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required disabled={saving} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input label="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.currentTarget.value)} disabled={saving} />
              <Text size="xs" c="dimmed">Required only if changing password</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} disabled={saving} />
            </Grid.Col>
          </Grid>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
