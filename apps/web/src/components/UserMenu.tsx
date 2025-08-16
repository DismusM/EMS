'use client';

import { Menu, Avatar, Text, Group, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconSettings, IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function UserMenu() {
  const { authState, logout } = useAuth();

  if (!authState.user) return null;

  return (
    <Group justify="flex-end" px="md">
      <Menu position="bottom-end" width={200}>
        <Menu.Target>
          <UnstyledButton>
            <Group gap={7}>
              <Avatar 
                src={authState.user.avatarUrl ?? undefined} 
                alt={authState.user.name} 
                radius="xl" 
                size={32}
              />
              <Text fw={500} size="sm" mr={3}>
                {authState.user.name}
              </Text>
              <IconChevronDown size={12} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item 
            leftSection={<IconSettings size={14} />}
            component={Link}
            href="/profile"
          >
            Profile Settings
          </Menu.Item>
          <Menu.Item 
            leftSection={<IconLogout size={14} />}
            onClick={logout}
            color="red"
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
