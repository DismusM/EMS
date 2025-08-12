import { Button as MantineButton, ButtonProps } from '@mantine/core';
import React from 'react';

interface Props extends ButtonProps {
  customProp?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = (props: Props) => {
  return <MantineButton {...props} />;
};
