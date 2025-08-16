import { Group, Title, Box, useMantineTheme, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { UserMenu } from '../auth/UserMenu';
import { useAuth } from '@/lib/auth/useAuth';

export function MainHeader() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const { user } = useAuth();

  return (
    <Box 
      px="md" 
      style={{
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        backgroundColor: theme.white,
      }}
    >
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            mr="xl"
          />
          <Title order={4} c={theme.primaryColor}>
            Equipment Management System
          </Title>
        </Group>
        
        <Group>
          {user && <UserMenu user={user} />}
        </Group>
      </Group>
    </Box>
  );
}
