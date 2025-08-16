'use client';

import { LoginForm } from '@ems/user-management';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Container, Paper, Title, MantineProvider, createTheme } from '@mantine/core';
import { useEffect } from 'react';
import { User } from '@ems/shared';

export default function LoginPage() {
  const { login, authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.isAuthenticated) {
      // Beginner note: after login, the home for logged-in users is '/dashboard'
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, router]);

  const handleLoginSuccess = (token: string, user: User) => {
    login(token, user);
    // Beginner note: send to dashboard after successful login
    router.push('/dashboard');
  };

  const theme = createTheme({
    // Ensure default theme is used
    fontFamily: 'Inter, sans-serif',
  });

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Container size={420} my={40}>
        <Title ta="center" mb="xl">Welcome Back!</Title>
        <Paper withBorder shadow="md" p={30} radius="md">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </Paper>
      </Container>
    </MantineProvider>
  );
}
