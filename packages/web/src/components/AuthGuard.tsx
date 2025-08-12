'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This check runs on the client side
    if (typeof window !== 'undefined' && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isAuthenticated, router]);

  // While checking, we can show a loader or nothing
  if (!authState.isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};
