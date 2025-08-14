'use client';

import React, { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '../context/AuthContext';

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider>
      <AuthProvider>{children}</AuthProvider>
    </MantineProvider>
  );
}
