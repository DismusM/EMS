'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Center, Loader } from '@mantine/core';

interface AuthGuardProps {
  children: ReactNode;
  /**
   * Beginner note:
   * redirectTo tells AuthGuard where to send the user if they are NOT logged in.
   * By default we send them to the login page. For the dashboard we will
   * override this to send them back to the public landing page ('/').
   */
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = '/login' }: AuthGuardProps) => {
  const { authState, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial loading is complete before checking authentication
    if (!loading && !authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, authState.isAuthenticated, redirectTo, router]);

  // While the authentication state is loading, show a loader.
  // This prevents a flicker of the login page for authenticated users.
  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  // If authenticated, render the children.
  // Otherwise, the useEffect will handle the redirect, so we can return null or a loader.
  return authState.isAuthenticated ? <>{children}</> : (
    <Center style={{ height: '100vh' }}>
      <Loader />
    </Center>
  );
};
