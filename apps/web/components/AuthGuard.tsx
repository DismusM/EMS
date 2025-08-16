'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Loader, Center } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && !authState.token) {
      router.push('/login');
    }
  }, [authState.isLoading, authState.token, router]);

  if (authState.isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!authState.token) {
    return null;
  }

  return <>{children}</>;
};
