"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "@ems/shared";
import { Table, Group, Alert, Title, Select, TextInput, Button, Menu, Badge, Stack, Modal, Loader, Text } from "@mantine/core";
import { getUsers, updateUserRole, setUserActive, deleteUser, getUserActivity } from "../api/apiClient";

interface UsersTableProps {
  token: string;
  currentUserId: string;
  refreshKey?: number;
  onChanged?: () => void;
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "technician", label: "Technician" },
  { value: "asset_manager", label: "Asset Manager" },
  { value: "client", label: "Client" },
];

const statusOptions = [
  { value: "approved", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Disabled" },
];

export const UsersTable: React.FC<UsersTableProps> = ({ token, currentUserId, refreshKey, onChanged }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Activity modal state
  const [activityOpened, setActivityOpened] = useState(false);
  const [activityUserId, setActivityUserId] = useState<string | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getUsers(token, statusFilter as any, roleFilter ?? undefined, search || undefined);
      setUsers(list);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, roleFilter, statusFilter, search, refreshKey]);

  const handleChangeRole = async (userId: string, newRoleId: string) => {
    try {
      await updateUserRole(userId, newRoleId, token);
      await fetchUsers();
      onChanged?.();
    } catch (e: any) {
      setError(e.message || "Failed to change role");
    }
  };

  const handleToggleActive = async (user: User) => {
    const active = (user as any).status === "approved" ? false : true; // approved -> deactivate, else activate
    try {
      await setUserActive(user.id, active, token);
      await fetchUsers();
      onChanged?.();
    } catch (e: any) {
      setError(e.message || "Failed to update active status");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId, token);
      await fetchUsers();
      onChanged?.();
    } catch (e: any) {
      setError(e.message || "Failed to delete user");
    }
  };

  const handleViewActivity = async (userId: string) => {
    setActivityOpened(true);
    setActivityUserId(userId);
    setActivity([]);
    setActivityError(null);
    setActivityLoading(true);
    try {
      const logs = await getUserActivity(userId, token);
      setActivity(logs);
    } catch (e: any) {
      setActivityError(e.message || 'Failed to fetch activity');
    } finally {
      setActivityLoading(false);
    }
  };

  const rows = useMemo(() => users.map((u) => {
    const uAny = u as any;
    const isSelf = u.id === currentUserId;
    return (
      <Table.Tr key={u.id}>
        <Table.Td>{u.name}</Table.Td>
        <Table.Td>{u.email}</Table.Td>
        <Table.Td><Badge variant="light">{u.role || "-"}</Badge></Table.Td>
        <Table.Td>
          {uAny.status === "approved" && <Badge color="green">active</Badge>}
          {uAny.status === "pending" && <Badge color="yellow">pending</Badge>}
          {uAny.status === "rejected" && <Badge color="gray">disabled</Badge>}
        </Table.Td>
        <Table.Td>
          <Menu withinPortal shadow="md">
            <Menu.Target>
              <Button size="xs" variant="light">Actions</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Role</Menu.Label>
              {roleOptions.map((r) => (
                <Menu.Item key={r.value} disabled={isSelf} onClick={() => handleChangeRole(u.id, r.value)}>
                  {r.label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Item onClick={() => handleViewActivity(u.id)}>
                View Activity
              </Menu.Item>
              <Menu.Item disabled={isSelf} onClick={() => handleToggleActive(u)}>
                {uAny.status === "approved" ? "Deactivate" : "Activate"}
              </Menu.Item>
              <Menu.Item color="red" disabled={isSelf} onClick={() => handleDelete(u.id)}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    );
  }), [users, currentUserId]);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>All Users</Title>
        <Group>
          <Select placeholder="Filter by role" data={roleOptions} clearable value={roleFilter} onChange={setRoleFilter} />
          <Select placeholder="Filter by status" data={statusOptions} clearable value={statusFilter} onChange={setStatusFilter} />
          <TextInput placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
          <Button variant="light" onClick={fetchUsers} loading={loading}>Refresh</Button>
        </Group>
      </Group>
      {error && <Alert color="red" title="Error">{error}</Alert>}
      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Modal opened={activityOpened} onClose={() => setActivityOpened(false)} title="User Activity" size="lg">
        {activityLoading && <Group justify="center"><Loader /></Group>}
        {activityError && <Alert color="red" title="Error">{activityError}</Alert>}
        {!activityLoading && !activityError && (
          activity.length > 0 ? (
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>When</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Actor</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {activity.map((log: any) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>{new Date(log.createdAt).toLocaleString()}</Table.Td>
                    <Table.Td><Badge>{log.action}</Badge></Table.Td>
                    <Table.Td>{log.actorId}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text>No activity found.</Text>
          )
        )}
      </Modal>
    </Stack>
  );
};
