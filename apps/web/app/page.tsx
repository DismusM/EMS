import Link from 'next/link';
import { Button, Container, Title, Text, Group, Stack, Card, SimpleGrid, Box, Center } from '@mantine/core';
import { IconTool, IconUsers, IconShieldCheck, IconChartBar } from '@tabler/icons-react';

export default function Home() {
  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container size="lg" py={80}>
        <Center>
          <Stack align="center" gap="xl">
            <Title 
              order={1} 
              size="3.5rem" 
              fw={700}
              ta="center"
              c="#1E88E5"
            >
              Equipment Maintenance System
            </Title>
            
            <Text 
              size="xl" 
              ta="center" 
              c="dimmed" 
              maw={600}
            >
              Streamline your equipment maintenance and management with our comprehensive, 
              role-based solution. Centralize assets, manage users, and scale with confidence.
            </Text>
            
            <Group gap="md" mt="xl">
              <Button 
                component={Link} 
                href="/login" 
                size="lg" 
                variant="filled"
                color="#1E88E5"
                radius="md"
              >
                Sign In
              </Button>
              <Button 
                component={Link} 
                href="/signup" 
                size="lg" 
                variant="outline"
                color="#1E88E5"
                radius="md"
              >
                Create Account
              </Button>
            </Group>
          </Stack>
        </Center>
      </Container>

      {/* Features Section */}
      <Container size="lg" py={60}>
        <Stack align="center" gap="xl">
          <Title order={2} ta="center" c="#1E88E5">
            Why Choose EMS?
          </Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            <Card withBorder shadow="sm" padding="lg" radius="md" bg="white">
              <Stack align="center" gap="md">
                <IconTool size="3rem" color="#1E88E5" />
                <Title order={4} ta="center">Asset Management</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Track, manage, and maintain all your equipment with QR codes and detailed records
                </Text>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" padding="lg" radius="md" bg="white">
              <Stack align="center" gap="md">
                <IconUsers size="3rem" color="#1E88E5" />
                <Title order={4} ta="center">User Management</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Role-based access control with approval workflows for secure team collaboration
                </Text>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" padding="lg" radius="md" bg="white">
              <Stack align="center" gap="md">
                <IconShieldCheck size="3rem" color="#1E88E5" />
                <Title order={4} ta="center">Security First</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Enterprise-grade security with data isolation and comprehensive audit trails
                </Text>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" padding="lg" radius="md" bg="white">
              <Stack align="center" gap="md">
                <IconChartBar size="3rem" color="#1E88E5" />
                <Title order={4} ta="center">Scalable Design</Title>
                <Text size="sm" ta="center" c="dimmed">
                  Modern monorepo architecture that grows with your organization's needs
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Container size="lg" py={60}>
        <Card withBorder shadow="md" padding="xl" radius="md" bg="#1E88E5">
          <Stack align="center" gap="lg">
            <Title order={2} ta="center" c="white">
              Ready to Get Started?
            </Title>
            <Text size="lg" ta="center" c="white" opacity={0.9}>
              Join organizations already using EMS to streamline their equipment management
            </Text>
            <Button 
              component={Link} 
              href="/signup" 
              size="lg" 
              variant="white"
              color="#1E88E5"
              radius="md"
            >
              Start Your Free Account
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
