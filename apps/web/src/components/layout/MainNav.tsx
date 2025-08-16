import { NavLink, Stack, Text, rem } from '@mantine/core';
import { 
  IconBuildingWarehouse, 
  IconTool, 
  IconClipboardList,
  IconUsers,
  IconSettings,
  IconDashboard,
  IconReportAnalytics
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Role } from '@ems/shared/types/user';

const navItems = [
  { 
    label: 'Dashboard', 
    icon: IconDashboard, 
    href: '/dashboard',
    roles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN, Role.VIEWER] 
  },
  { 
    label: 'Assets', 
    icon: IconBuildingWarehouse, 
    href: '/assets',
    roles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN, Role.VIEWER] 
  },
  { 
    label: 'Work Orders', 
    icon: IconClipboardList, 
    href: '/work-orders',
    roles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN] 
  },
  { 
    label: 'Maintenance', 
    icon: IconTool, 
    href: '/maintenance',
    roles: [Role.ADMIN, Role.MANAGER, Role.TECHNICIAN] 
  },
  { 
    label: 'Users', 
    icon: IconUsers, 
    href: '/users',
    roles: [Role.ADMIN] 
  },
  { 
    label: 'Reports', 
    icon: IconReportAnalytics, 
    href: '/reports',
    roles: [Role.ADMIN, Role.MANAGER] 
  },
  { 
    label: 'Settings', 
    icon: IconSettings, 
    href: '/settings',
    roles: [Role.ADMIN] 
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role as Role)
  );

  return (
    <Stack gap={0}>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || 
                        (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            leftSection={<Icon style={{ width: rem(20), height: rem(20) }} />}
            active={isActive}
            variant="filled"
            mb={4}
            styles={(theme) => ({
              root: {
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colors.gray[1],
                },
              },
              label: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          />
        );
      })}
    </Stack>
  );
}
