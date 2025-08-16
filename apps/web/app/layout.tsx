import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { AuthProvider } from '@/context/AuthContext';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e3f2fd',
      '#bbdefb',
      '#90caf9',
      '#64b5f6',
      '#42a5f5',
      '#2196f3',
      '#1e88e5', // Primary brand color
      '#1976d2',
      '#1565c0',
      '#0d47a1'
    ]
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    AppShell: {
      styles: {
        header: {
          backgroundColor: '#1e88e5',
          borderBottom: 'none',
        },
        navbar: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e9ecef',
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <title>Equipment Maintenance System</title>
        <meta name="description" content="Modern equipment maintenance and asset management system" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
