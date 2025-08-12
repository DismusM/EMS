'use client';

import React, { useState } from 'react';
import { Card, Input, Button } from '@ems/ui';
import { Stack, Title, Alert, Select } from '@mantine/core';
import { createUser } from '../api/apiClient';

interface CreateUserFormProps {
  token: string;
  onUserCreated: () => void;
}

export const CreateUserForm = ({ token, onUserCreated }: CreateUserFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await createUser({ name, email, password, roleId }, token);
      setSuccess(true);
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setRoleId(null);
      onUserCreated();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Create New User</Title>
          {error && <Alert color="red" title="Creation Failed">{error}</Alert>}
          {success && <Alert color="green" title="Success">User created successfully!</Alert>}
          <Input label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required disabled={loading} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required disabled={loading} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required disabled={loading} />
          <Select
            label="Role"
            placeholder="Select a role"
            value={roleId}
            onChange={setRoleId}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'technician', label: 'Technician' },
              { value: 'asset_manager', label: 'Asset Manager' },
              { value: 'client', label: 'Client' },
            ]}
            required
            disabled={loading}
          />
          <Button type="submit" loading={loading}>Create User</Button>
        </Stack>
      </form>
    </Card>
  );
};
