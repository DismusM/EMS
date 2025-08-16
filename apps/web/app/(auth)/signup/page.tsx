'use client';

import { useState } from 'react';
import { SignupForm } from '@ems/user-management';
import { Container, Title, Text, Paper, Center } from '@mantine/core';

export default function SignupPage() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
  };

  return (
    <Container size="xs" my={40}>
      <Center>
        <Paper withBorder shadow="md" p={30} radius="md">
          {isSignedUp ? (
            <div>
              <Title order={2} ta="center">Thank you for signing up!</Title>
              <Text ta="center" mt="md">
                Your account has been created and is now pending approval from an administrator.
              </Text>
              <Text ta="center" mt="sm">
                You will be notified via email once your account is approved.
              </Text>
            </div>
          ) : (
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          )}
        </Paper>
      </Center>
    </Container>
  );
}
