'use client';

import { NavLink, Stack } from '@mantine/core';
import { AppShellNavbar } from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconTools,
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import Link from 'next/link';
import type { User, Role } from '@ems/shared';
import { ADMIN_ROLES } from '@ems/shared/utils/roles';

type NavItem = {
  label: string;
  icon?: React.ReactNode;
  href: string;
  roles?: Role[];
};

export function MainNav({ userRole }: { userRole?: Role }) {
  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <IconDashboard size={18} />, href: '/dashboard' },
    { label: 'Users', icon: <IconUsers size={18} />, href: '/users', roles: ADMIN_ROLES },
    { label: 'Equipment', icon: <IconTools size={18} />, href: '/assets' },
    { label: 'Settings', icon: <IconSettings size={18} />, href: '/settings' },
  ];

  return (
    <AppShellNavbar p="xs" withBorder={false}>
      <Stack gap={4} p="sm">
        {navItems
          .filter(item => !item.roles || (userRole && item.roles.includes(userRole)))
          .map(item => (
            <NavLink 
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={item.icon}
            />
          ))
        }
        <NavLink 
          component={Link}
          href="/logout"
          label="Logout"
          leftSection={<IconLogout size={18} />}
        />
      </Stack>
    </AppShellNavbar>
  );
}
