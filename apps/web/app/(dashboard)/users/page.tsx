'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '../../../components/AuthGuard';
import { AppLayout } from '../../../components/AppLayout';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Title, 
  Card, 
  Group, 
  Stack, 
  Text, 
  Badge, 
  Button,
  Table,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Drawer,
  Alert,
  Center,
  Loader
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconUserPlus, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export default function UserManagementPage() {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'TECHNICIAN'
  });

  const isAdmin = authState.user?.role === 'admin';

  useEffect(() => {
    // Mock users data - in real app, fetch from API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'TECHNICIAN',
        status: 'approved',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:22:00Z'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'SUPERVISOR',
        status: 'approved',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike.wilson@company.com',
        role: 'TECHNICIAN',
        status: 'pending',
        createdAt: '2024-01-18T11:20:00Z'
      },
      {
        id: '4',
        name: 'Lisa Chen',
        email: 'lisa.chen@company.com',
        role: 'ASSET_MANAGER',
        status: 'approved',
        createdAt: '2024-01-12T13:45:00Z',
        lastLogin: '2024-01-20T09:30:00Z'
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'SUPERVISOR': return 'blue';
      case 'ASSET_MANAGER': return 'purple';
      case 'TECHNICIAN': return 'green';
      case 'CLIENT': return 'orange';
      default: return 'gray';
    }
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'approved' as const } : user
    ));
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'suspended' as const } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === authState.user?.id) {
      alert('You cannot delete your own account');
      return;
    }
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleEditUser = (user: User) => {
    if (user.id === authState.user?.id && user.role !== authState.user?.role) {
      alert('You cannot change your own role');
      return;
    }
    setSelectedUser(user);
    setEditDrawerOpened(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      setEditDrawerOpened(false);
      setSelectedUser(null);
    }
  };

  const handleAddUser = () => {
    const newId = (users.length + 1).toString();
    const userToAdd: User = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setUsers([...users, userToAdd]);
    setAddModalOpened(false);
    setNewUser({ name: '', email: '', role: 'TECHNICIAN' });
  };

  if (!isAdmin) {
    return (
      <AuthGuard>
        <AppLayout>
          <Stack gap="lg">
            <Title order={2}>Access Denied</Title>
            <Alert icon={<IconAlertCircle size="1rem" />} title="Insufficient Permissions" color="red">
              You don't have permission to access the User Management page. Only administrators can manage users.
            </Alert>
          </Stack>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>User Management</Title>
            <Button 
              variant="filled" 
              color="#1e88e5"
              leftSection={<IconUserPlus size="1rem" />}
              onClick={() => setAddModalOpened(true)}
            >
              Add New User
            </Button>
          </Group>

          {loading ? (
            <Center h={300}>
              <Loader size="lg" />
            </Center>
          ) : (
            <Card withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Last Login</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Text fw={500}>{user.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{user.email}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getRoleColor(user.role)} variant="light">
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(user.status)} variant="light">
                          {user.status.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c={user.lastLogin ? 'dark' : 'dimmed'}>
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {user.status === 'pending' && (
                            <ActionIcon
                              variant="light"
                              color="green"
                              size="sm"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <IconCheck size="1rem" />
                            </ActionIcon>
                          )}
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDots size="1rem" />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconEdit size="1rem" />}
                                onClick={() => handleEditUser(user)}
                              >
                                Edit User
                              </Menu.Item>
                              {user.status === 'approved' && (
                                <Menu.Item
                                  leftSection={<IconX size="1rem" />}
                                  onClick={() => handleSuspendUser(user.id)}
                                  color="orange"
                                >
                                  Suspend User
                                </Menu.Item>
                              )}
                              {user.status === 'suspended' && (
                                <Menu.Item
                                  leftSection={<IconCheck size="1rem" />}
                                  onClick={() => handleApproveUser(user.id)}
                                  color="green"
                                >
                                  Reactivate User
                                </Menu.Item>
                              )}
                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<IconTrash size="1rem" />}
                                onClick={() => handleDeleteUser(user.id)}
                                color="red"
                                disabled={user.id === authState.user?.id}
                              >
                                Delete User
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}

          {/* Add User Modal */}
          <Modal
            opened={addModalOpened}
            onClose={() => {
              setAddModalOpened(false);
              setNewUser({ name: '', email: '', role: 'TECHNICIAN' });
            }}
            title="Add New User"
            size="md"
            centered
          >
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              
              <TextInput
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              
              <Select
                label="Role"
                data={[
                  { value: 'TECHNICIAN', label: 'Technician' },
                  { value: 'SUPERVISOR', label: 'Supervisor' },
                  { value: 'ASSET_MANAGER', label: 'Asset Manager' },
                  { value: 'CLIENT', label: 'Client' },
                  { value: 'GUEST', label: 'Guest' }
                ]}
                value={newUser.role}
                onChange={(value) => setNewUser({ ...newUser, role: value || 'TECHNICIAN' })}
              />
              
              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddModalOpened(false);
                    setNewUser({ name: '', email: '', role: 'TECHNICIAN' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="#1e88e5"
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                >
                  Add User
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* Edit User Drawer */}
          <Drawer
            opened={editDrawerOpened}
            onClose={() => {
              setEditDrawerOpened(false);
              setSelectedUser(null);
            }}
            title="Edit User"
            position="right"
            size="md"
          >
            {selectedUser && (
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
                
                <TextInput
                  label="Email Address"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
                
                <Select
                  label="Role"
                  data={[
                    { value: 'TECHNICIAN', label: 'Technician' },
                    { value: 'SUPERVISOR', label: 'Supervisor' },
                    { value: 'ASSET_MANAGER', label: 'Asset Manager' },
                    { value: 'CLIENT', label: 'Client' },
                    { value: 'GUEST', label: 'Guest' }
                  ]}
                  value={selectedUser.role}
                  onChange={(value) => setSelectedUser({ ...selectedUser, role: value || selectedUser.role })}
                  disabled={selectedUser.id === authState.user?.id}
                />
                
                <Select
                  label="Status"
                  data={[
                    { value: 'pending', label: 'Pending Approval' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                  value={selectedUser.status}
                  onChange={(value) => setSelectedUser({ ...selectedUser, status: value as User['status'] || selectedUser.status })}
                />
                
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditDrawerOpened(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="#1e88e5"
                    onClick={handleSaveUser}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            )}
          </Drawer>
        </Stack>
      </AppLayout>
    </AuthGuard>
  );
}
