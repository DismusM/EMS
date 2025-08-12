import { Container, ContainerProps } from '@mantine/core';
import React from 'react';

interface Props extends ContainerProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children, ...props }: Props) => {
  return (
    <Container fluid p="md" {...props}>
      {children}
    </Container>
  );
};
