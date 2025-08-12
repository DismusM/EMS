'use client';

import React, { ReactNode } from 'react';
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export function AppLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { authState, logout } = useAuth();

  // Determine which links to show based on user role
  const navLinks = [
    { label: 'Dashboard', href: '/', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'Assets', href: '/assets', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'User Management', href: '/users', roles: ['admin'] },
  ];

  const userCanSee = (link: typeof navLinks[0]) => {
      return authState.user && link.roles.includes(authState.user.role.id);
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>Equipment Maintenance System</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navLinks.filter(userCanSee).map((link) => (
            <NavLink key={link.href} component={Link} href={link.href} label={link.label} />
        ))}
        <NavLink label="Logout" onClick={logout} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
