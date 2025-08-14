'use client';

import React, { ReactNode } from 'react';
import { AppShell, Burger, Group, NavLink, Title, Menu, Avatar, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import { IconLogout, IconUser } from '@tabler/icons-react';

export function AppLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { authState, logout } = useAuth();

  // Simplified navigation structure as requested
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'User Management', href: '/users', roles: ['admin'] },
    { label: 'Assets', href: '/assets', roles: ['admin', 'supervisor', 'technician', 'asset_manager', 'client'] },
    { label: 'Work Orders', href: '/work-orders', roles: ['admin', 'supervisor'] },
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
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Equipment Maintenance System</Title>
          </Group>
          
          {authState.user && (
            <Menu width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar src={null} alt={authState.user.name} radius="xl" size={32}>
                      <IconUser size="1rem" />
                    </Avatar>
                    <Text fw={500} size="sm" mr={3}>
                      {authState.user.name}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item 
                  component={Link} 
                  href="/profile"
                  leftSection={<IconUser size="1rem" />}
                >
                  My Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red"
                  onClick={logout}
                  leftSection={<IconLogout size="1rem" />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navLinks.filter(userCanSee).map((link) => (
            <NavLink key={link.href} component={Link} href={link.href} label={link.label} />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
