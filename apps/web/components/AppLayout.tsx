'use client';

import { ReactNode } from 'react';
import { AppShell, Text, NavLink, Group, Menu, UnstyledButton, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconDashboard, 
  IconSettings, 
  IconUsers, 
  IconTool,
  IconLogout,
  IconUser,
  IconChevronDown
} from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '@ems/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { authState, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const userRole = authState.user?.role;

  const navigationItems = [
    {
      icon: IconDashboard,
      label: 'Dashboard',
      href: '/dashboard',
      roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.CLIENT]
    },
    {
      icon: IconTool,
      label: 'Asset Management',
      href: '/assets',
      roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.SUPERVISOR, ROLES.TECHNICIAN]
    },
    {
      icon: IconUsers,
      label: 'User Management',
      href: '/users',
      roles: [ROLES.ADMIN]
    }
  ];

  const visibleNavItems = navigationItems.filter(item => {
    // Handle both string roles (from backend) and ROLES constants
    if (!userRole) return false;
    
    const roleString = String(userRole);
    const userRoleString = roleString === 'admin' ? 'ADMIN' : 
                          roleString === 'asset_manager' ? 'ASSET_MANAGER' :
                          roleString === 'supervisor' ? 'SUPERVISOR' :
                          roleString === 'technician' ? 'TECHNICIAN' :
                          roleString === 'client' ? 'CLIENT' : 
                          roleString.toUpperCase();
    
    return item.roles.includes(userRoleString as any);
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Text size="lg" fw={700} c="white">
              EMS - Equipment Maintenance System
            </Text>
          </Group>
          
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar size="sm" radius="xl" color="blue">
                    {authState.user?.name?.charAt(0)}
                  </Avatar>
                  <Text c="white" size="sm" fw={500}>
                    {authState.user?.name}
                  </Text>
                  <IconChevronDown size="1rem" color="white" />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item 
                leftSection={<IconUser size="1rem" />}
                component={Link}
                href="/profile"
              >
                Profile Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconLogout size="1rem" />}
                onClick={handleLogout}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md">
          Navigation
        </Text>
        
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            leftSection={<item.icon size="1rem" />}
            mb="xs"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
