import { ReactNode } from 'react';
import { AppShell, Box } from '@mantine/core';
import { MainHeader } from './MainHeader';
import { MainNav } from './MainNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <MainHeader />
      </AppShell.Header>
      
      <AppShell.Navbar p="md">
        <MainNav />
      </AppShell.Navbar>
      
      <AppShell.Main>
        <Box style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
