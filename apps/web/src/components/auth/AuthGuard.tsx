import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Loader, Center, Text } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string | string[];
}

export function AuthGuard({ children, redirectTo = '/login', requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(redirectTo);
    } else if (!loading && isAuthenticated && requiredRole) {
      // Check if user has required role if specified
      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.some(role => user?.role === role)
        : user?.role === requiredRole;

      if (!hasRequiredRole) {
        // Redirect to unauthorized or home if role check fails
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, redirectTo, requiredRole, router, user]);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="xl" variant="dots" />
          <Text mt="md">Verifying authentication...</Text>
        </div>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center style={{ height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="xl" variant="dots" />
          <Text mt="md">Redirecting to login...</Text>
        </div>
      </Center>
    );
  }

  // Check role if required
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.some(role => user?.role === role)
      : user?.role === requiredRole;

    if (!hasRequiredRole) {
      return (
        <Center style={{ height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Text size="xl" weight={700} mb="md">
              Access Denied
            </Text>
            <Text>You don't have permission to view this page.</Text>
          </div>
        </Center>
      );
    }
  }

  return <>{children}</>;
}
