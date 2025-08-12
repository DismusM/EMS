'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Center, Loader } from '@mantine/core';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) {
    return (
      <Center mih={200}>
        <Loader />
      </Center>
    );
  }

  return <>{children}</>;
};
