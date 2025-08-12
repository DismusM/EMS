import { Card as MantineCard, CardProps } from '@mantine/core';
import React from 'react';

interface Props extends CardProps {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: Props) => {
  return (
    <MantineCard shadow="sm" padding="lg" radius="md" withBorder {...props}>
      {children}
    </MantineCard>
  );
};
