 'use client';

import { TextInput as MantineTextInput, TextInputProps } from '@mantine/core';
import React from 'react';

interface Props extends TextInputProps {
  // Custom props can be added here
}

export const Input = (props: Props) => {
  return <MantineTextInput {...props} />;
};
