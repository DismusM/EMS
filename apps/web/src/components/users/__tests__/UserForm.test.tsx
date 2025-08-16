import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../UserForm';
import { Role } from '@ems/shared/types/user';
import { mockUser } from '@/lib/testing/test-utils';

describe('UserForm', () => {
  const mockSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with initial values', () => {
    const initialValues = {
      name: 'Test User',
      email: 'test@example.com',
      role: Role.ADMIN,
    };

    render(
      <UserForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText('Full Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email Address')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Role')).toHaveValue(Role.ADMIN);
  });

  it('validates required fields', async () => {
    render(
      <UserForm
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create user/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates password when creating a new user', async () => {
    render(
      <UserForm
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    // Fill in required fields
    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    
    // Try to submit with mismatched passwords
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'differentpassword');
    
    const submitButton = screen.getByRole('button', { name: /create user/i });
    await user.click(submitButton);

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(
      <UserForm
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    // Fill in the form
    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    
    // Select role from dropdown
    await user.click(screen.getByLabelText('Role'));
    const adminOption = await screen.findByRole('option', { name: /admin/i });
    await user.click(adminOption);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: Role.ADMIN,
      }, expect.anything()); // The second argument is the form event
    });
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(
      <UserForm
        onSubmit={mockSubmit}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create user/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables the email field in edit mode', () => {
    const initialValues = {
      name: 'Test User',
      email: 'test@example.com',
      role: Role.ADMIN,
    };

    render(
      <UserForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        isSubmitting={false}
        isEdit={true}
      />
    );

    expect(screen.getByLabelText('Email Address')).toBeDisabled();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update user/i })).toBeInTheDocument();
  });
});
