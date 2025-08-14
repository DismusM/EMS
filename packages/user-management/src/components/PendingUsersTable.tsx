'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@ems/shared';
import { Table, Button, Group, Alert, Title, Text } from '@mantine/core';
import { getUsers, updateUserStatus } from '../api/apiClient';

interface PendingUsersTableProps {
  token: string;
  refreshKey?: number;
}

export const PendingUsersTable = ({ token, refreshKey }: PendingUsersTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    try {
      const pendingUsers = await getUsers(token, 'pending');
      setUsers(pendingUsers);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPendingUsers();
    }
  }, [token, refreshKey]);

  const handleUpdateStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await updateUserStatus(userId, status, token);
      // Refresh the list after updating
      fetchPendingUsers();
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.name}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{new Date(user.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" color="green" onClick={() => handleUpdateStatus(user.id, 'approved')}>
            Approve
          </Button>
          <Button size="xs" color="red" onClick={() => handleUpdateStatus(user.id, 'rejected')}>
            Reject
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Title order={3} mt="xl" mb="md">Pending Approvals</Title>
      {error && <Alert color="red" title="Error">{error}</Alert>}
      {rows.length > 0 ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Registered On</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <Text>No users are currently pending approval.</Text>
      )}
    </div>
  );
};
