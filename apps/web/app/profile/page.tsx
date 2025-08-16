'use client';

import { useState } from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { 
  Title, 
  Card, 
  Stack, 
  Text, 
  TextInput, 
  Button, 
  Group, 
  Badge,
  Avatar,
  Divider,
  Alert
} from '@mantine/core';
import { IconUser, IconMail, IconShield, IconCheck, IconX } from '@tabler/icons-react';

export default function ProfilePage() {
  const { authState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    email: authState.user?.email || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: authState.user?.name || '',
      email: authState.user?.email || ''
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'ASSET_MANAGER': return 'blue';
      case 'SUPERVISOR': return 'green';
      case 'TECHNICIAN': return 'orange';
      case 'CLIENT': return 'gray';
      default: return 'gray';
    }
  };

  if (!authState.token) return null;

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Profile Settings</Title>
          </Group>

          <Card withBorder padding="xl" radius="md">
            <Stack gap="lg">
              <Group>
                <Avatar size="xl" radius="xl" color="blue">
                  {authState.user?.name?.charAt(0)}
                </Avatar>
                <div>
                  <Text size="xl" fw={600}>{authState.user?.name}</Text>
                  <Text c="dimmed">{authState.user?.email}</Text>
                  <Badge 
                    color={getRoleColor(authState.user?.role || '')} 
                    variant="light" 
                    mt="xs"
                  >
                    {authState.user?.role || 'No Role'}
                  </Badge>
                </div>
              </Group>

              <Divider />

              <Stack gap="md">
                <Text size="lg" fw={500}>Account Information</Text>
                
                {isEditing ? (
                  <Stack gap="md">
                    <TextInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      leftSection={<IconUser size="1rem" />}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    
                    <TextInput
                      label="Email Address"
                      placeholder="Enter your email"
                      leftSection={<IconMail size="1rem" />}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Group gap="sm">
                      <Button 
                        leftSection={<IconCheck size="1rem" />}
                        onClick={handleSave}
                        color="#1e88e5"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        leftSection={<IconX size="1rem" />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="md">
                    <Group>
                      <IconUser size="1rem" color="#1e88e5" />
                      <div>
                        <Text size="sm" c="dimmed">Full Name</Text>
                        <Text fw={500}>{authState.user?.name}</Text>
                      </div>
                    </Group>

                    <Group>
                      <IconMail size="1rem" color="#1e88e5" />
                      <div>
                        <Text size="sm" c="dimmed">Email Address</Text>
                        <Text fw={500}>{authState.user?.email}</Text>
                      </div>
                    </Group>

                    <Group>
                      <IconShield size="1rem" color="#1e88e5" />
                      <div>
                        <Text size="sm" c="dimmed">Role</Text>
                        <Badge color={getRoleColor(authState.user?.role || '')} variant="light">
                          {authState.user?.role || 'No Role'}
                        </Badge>
                      </div>
                    </Group>

                    <Button 
                      variant="outline" 
                      color="#1e88e5"
                      onClick={() => setIsEditing(true)}
                      mt="md"
                    >
                      Edit Profile
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Divider />

              <Alert color="blue" title="Account Status">
                Your account is active and verified. Contact your administrator if you need role changes.
              </Alert>
            </Stack>
          </Card>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
