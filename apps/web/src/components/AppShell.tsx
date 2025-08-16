'use client';

import { AppShell, Text } from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';
import { MainNav } from './MainNav';
import { UserMenu } from './UserMenu';

export function EMSAppShell({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: false },
      }}
      header={{
        height: 60,
        collapsed: false,
      }}
      footer={{
        height: 60,
        collapsed: false,
      }}
      styles={(theme) => ({
        main: { 
          backgroundColor: theme.colors.gray[0]
        },
      })}
    >
      <AppShell.Navbar p="xs">
        <MainNav userRole={authState.user?.role} />
      </AppShell.Navbar>
      <AppShell.Header p="xs">
        <UserMenu />
      </AppShell.Header>
      <AppShell.Footer p="xs">
        <Text size="sm">Equipment Maintenance System 2025</Text>
      </AppShell.Footer>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
