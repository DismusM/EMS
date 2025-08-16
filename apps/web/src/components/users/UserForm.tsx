import { useState, useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, PasswordInput, Select, Button, Stack, Box, Group } from '@mantine/core';
import { z } from 'zod';
import { Role } from '@ems/shared/types/user';

// Define validation schema with zod
const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  ...(isEdit ? {} : {
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  }),
}).refine(
  (data) => !('password' in data) || data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export function UserForm({
  initialValues = {
    name: '',
    email: '',
    role: Role.VIEWER,
  },
  onSubmit,
  isSubmitting,
  isEdit = false,
}: UserFormProps) {
  const [isClient, setIsClient] = useState(false);
  
  const form = useForm<UserFormValues>({
    initialValues: {
      name: '',
      email: '',
      role: Role.VIEWER,
      password: '',
      confirmPassword: '',
      ...initialValues,
    },
    validate: zodResolver(userSchema),
  });

  // Set isClient to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Full Name"
          placeholder="Enter full name"
          required
          {...form.getInputProps('name')}
        />
        
        <TextInput
          label="Email Address"
          placeholder="Enter email address"
          required
          type="email"
          {...form.getInputProps('email')}
          disabled={isEdit} // Email is not editable after creation
        />

        <Select
          label="Role"
          placeholder="Select role"
          required
          data={Object.entries(Role).map(([key, value]) => ({
            value,
            label: key.charAt(0) + key.slice(1).toLowerCase(),
          }))}
          {...form.getInputProps('role')}
        />

        {!isEdit && (
          <>
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              required
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              required
              {...form.getInputProps('confirmPassword')}
            />
          </>
        )}

        <Group position="right" mt="md">
          <Button 
            type="submit" 
            loading={isSubmitting}
            disabled={!form.isDirty()}
          >
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
