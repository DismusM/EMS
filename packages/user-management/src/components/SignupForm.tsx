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
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, phone, department, position);
      setSuccess(true);
      onSignupSuccess();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <Stack>
          <Title order={2}>Registration Submitted</Title>
          <Alert color="green" title="Success">
            Your registration has been submitted successfully! An administrator will review your account and approve it shortly. You will receive an email notification once your account is approved.
          </Alert>
        </Stack>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={2}>Sign Up</Title>
          <Alert color="blue" title="Account Approval Required">
            New accounts require administrator approval before you can access the system.
          </Alert>
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
          <Input
            label="Phone Number"
            placeholder="+1-555-0123"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            disabled={loading}
          />
          <Input
            label="Department"
            placeholder="IT, Operations, Maintenance, etc."
            value={department}
            onChange={(e) => setDepartment(e.currentTarget.value)}
            disabled={loading}
          />
          <Input
            label="Position"
            placeholder="Your job title"
            value={position}
            onChange={(e) => setPosition(e.currentTarget.value)}
            disabled={loading}
          />
          <Button type="submit" loading={loading}>
            Submit Registration
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
