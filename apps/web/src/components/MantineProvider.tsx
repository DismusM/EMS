'use client';

import { MantineProvider as MantineCoreProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Define your theme
const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
    ],
  },
});

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineCoreProvider theme={theme}>
      <Notifications position="top-right" />
      {children}
    </MantineCoreProvider>
  );
}
