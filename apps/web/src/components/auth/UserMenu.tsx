import { Menu, Avatar, Text, rem, UnstyledButton, Skeleton } from '@mantine/core';
import { IconLogout, IconSettings, IconUser, IconChevronDown } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth/useAuth';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    role: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();
  
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '4px',
          }}
          className="hover:bg-gray-100"
        >
          <Avatar 
            src={user.avatarUrl} 
            alt={user.name} 
            radius="xl"
            size={32}
          >
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <div style={{ flex: 1, textAlign: 'left', lineHeight: 1.2 }}>
            <Text size="sm" fw={500} truncate>
              {user.name}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {user.role}
            </Text>
          </div>
          <IconChevronDown size={16} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
          component="a"
          href="/profile"
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
          component="a"
          href="/settings"
        >
          Settings
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
          onClick={() => logout()}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function UserMenuSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Skeleton height={32} circle />
      <div>
        <Skeleton height={12} width={120} mb={4} />
        <Skeleton height={10} width={80} />
      </div>
    </div>
  );
}
