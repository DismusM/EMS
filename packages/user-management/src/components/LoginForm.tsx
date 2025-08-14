'use client';

import React, { useState } from 'react';
import { Card, Input, Button } from '@ems/ui';
import { Stack, Title, Alert, MantineProvider } from '@mantine/core';
import { login } from '../api/apiClient';

import { User } from '@ems/shared';

interface LoginFormProps {
  onLoginSuccess: (token:string, user: User) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { accessToken, user } = await login(email, password);
      onLoginSuccess(accessToken, user);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider>
      <Card>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Title order={2}>Login</Title>
            {error && <Alert color="red" title="Login Failed">{error}</Alert>}
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={loading}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={loading}
            />
            <Button type="submit" loading={loading}>
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </MantineProvider>
  );
};
