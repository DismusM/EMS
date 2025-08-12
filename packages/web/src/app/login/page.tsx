'use client';

import { LoginForm } from '@ems/user-management';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Container, Paper, Title } from '@mantine/core';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.isAuthenticated) {
      router.push('/');
    }
  }, [authState.isAuthenticated, router]);

  const handleLoginSuccess = (token: string) => {
    login(token);
    router.push('/');
  };

  return (
    <Container size={420} my={40}>
        <Title ta="center">Welcome Back!</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </Paper>
    </Container>
  );
}
