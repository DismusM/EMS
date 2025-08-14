'use client';

import React, { ReactNode } from 'react';
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export function AppLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { authState, logout } = useAuth();

  // Beginner note:
  // We show different menu links depending on WHO you are.
  // The table below is encoded as a mapping from link -> allowed roles.
  // This makes it very easy to tweak permissions in one place.
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'Assets', href: '/assets', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'My Profile', href: '/profile', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'User Management', href: '/users', roles: ['admin'] },
    { label: 'Work Orders', href: '/work-orders', roles: ['admin', 'supervisor'] },
    { label: 'My Tasks', href: '/my-tasks', roles: ['technician'] },
    { label: 'My Assets', href: '/my-assets', roles: ['client'] },
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
