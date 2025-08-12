import { Button as MantineButton, ButtonProps } from '@mantine/core';
import React from 'react';

// We can extend the props to add our own custom variants if needed
interface Props extends ButtonProps {
  // example of a custom prop
  customProp?: string;
}

export const Button = (props: Props) => {
  return <MantineButton {...props} />;
};
