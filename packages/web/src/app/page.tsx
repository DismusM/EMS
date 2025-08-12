'use client';

import { AuthGuard } from '../components/AuthGuard';
import { AppLayout } from '../components/AppLayout';
import { Title, Text } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
    const { authState } = useAuth();

    return (
        <AuthGuard>
            <AppLayout>
                <Title>Dashboard</Title>
                <Text>Welcome, {authState.user?.name}!</Text>
                <Text>Your role is: {authState.user?.role.name}</Text>
            </AppLayout>
        </AuthGuard>
    );
}
