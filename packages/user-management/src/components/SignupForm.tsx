'use client';

import React, { useState } from 'react';
import { Card, Input, Button } from '@ems/ui';
import { Stack, Title, Alert } from '@mantine/core';
import { register } from '../api/apiClient';

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export const SignupForm = ({ onSignupSuccess }: SignupFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      onSignupSuccess();
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
          <Title order={2}>Sign Up</Title>
          {error && <Alert color="red" title="Signup Failed">{error}</Alert>}
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            disabled={loading}
          />
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
            Sign Up
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
