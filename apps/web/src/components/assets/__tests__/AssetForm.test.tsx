import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetForm } from '../AssetForm';
import { AssetStatus, AssetType, MaintenancePriority, MaintenanceType } from '@ems/shared/types/asset';
import { vi } from 'vitest';

// Mock the DateInput component from @mantine/dates
vi.mock('@mantine/dates', () => ({
  DateInput: (props: any) => (
    <input
      type="date"
      data-testid="date-input"
      value={props.value?.toISOString().split('T')[0] || ''}
      onChange={(e) => props.onChange(new Date(e.target.value))}
      placeholder={props.placeholder}
    />
  ),
}));

// Mock the FileInput component
vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual('@mantine/core');
  return {
    ...actual,
    FileInput: (props: any) => (
      <input
        type="file"
        data-testid="file-input"
        onChange={(e) => props.onChange(e.target.files?.[0] || null)}
        accept={props.accept}
      />
    ),
  };
});

describe('AssetForm', () => {
  const mockSubmit = vi.fn();
  const user = userEvent.setup();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const assignedUsers = [
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with initial values', () => {
    const initialValues = {
      name: 'Test Asset',
      type: AssetType.EQUIPMENT,
      status: AssetStatus.IN_USE,
      location: 'Test Location',
      serialNumber: 'SN12345',
      model: 'Test Model',
      manufacturer: 'Test Manufacturer',
      purchaseDate: new Date('2023-01-01'),
      purchasePrice: 1000,
      notes: 'Test notes',
    };

    render(
      <AssetForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        isSubmitting={false}
        assignedUsers={assignedUsers}
      />
    );

    expect(screen.getByLabelText('Asset Name')).toHaveValue('Test Asset');
    expect(screen.getByLabelText('Location')).toHaveValue('Test Location');
    expect(screen.getByLabelText('Serial Number')).toHaveValue('SN12345');
    expect(screen.getByLabelText('Model')).toHaveValue('Test Model');
    expect(screen.getByLabelText('Manufacturer')).toHaveValue('Test Manufacturer');
    expect(screen.getByTestId('date-input')).toHaveValue('2023-01-01');
    expect(screen.getByLabelText('Purchase Price ($)')).toHaveValue(1000);
    expect(screen.getByLabelText('Notes')).toHaveValue('Test notes');
  });

  it('validates required fields', async () => {
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        assignedUsers={assignedUsers}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create asset/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Location is required')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        assignedUsers={assignedUsers}
      />
    );

    // Fill in the form
    await user.type(screen.getByLabelText('Asset Name'), 'Test Asset');
    await user.type(screen.getByLabelText('Location'), 'Test Location');
    await user.type(screen.getByLabelText('Serial Number'), 'SN12345');
    await user.type(screen.getByLabelText('Model'), 'Test Model');
    await user.type(screen.getByLabelText('Manufacturer'), 'Test Manufacturer');
    
    // Select date
    const dateInput = screen.getByTestId('date-input');
    await user.clear(dateInput);
    await user.type(dateInput, '2023-01-01');
    
    // Set purchase price
    await user.type(screen.getByLabelText('Purchase Price ($)'), '1000');
    
    // Select type from dropdown
    await user.click(screen.getByLabelText('Type'));
    const equipmentOption = await screen.findByRole('option', { name: /equipment/i });
    await user.click(equipmentOption);
    
    // Select status from dropdown
    await user.click(screen.getByLabelText('Status'));
    const inUseOption = await screen.findByRole('option', { name: /in use/i });
    await user.click(inUseOption);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create asset/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test Asset',
        type: AssetType.EQUIPMENT,
        status: AssetStatus.IN_USE,
        location: 'Test Location',
        serialNumber: 'SN12345',
        model: 'Test Model',
        manufacturer: 'Test Manufacturer',
        purchaseDate: new Date('2023-01-01'),
        purchasePrice: 1000,
        maintenancePriority: MaintenancePriority.MEDIUM,
        notes: '',
        assignedTo: undefined,
      }, expect.anything()); // The second argument is the form event
    });
  });

  it('shows maintenance fields in edit mode', () => {
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        isEdit={true}
        assignedUsers={assignedUsers}
      />
    );

    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByLabelText('Maintenance Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Maintenance Notes')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        assignedUsers={assignedUsers}
      />
    );

    // Upload a file
    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    
    // In a real test, you would mock the file upload and verify the preview
    // This is just verifying the file input was triggered
    expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={true}
        assignedUsers={assignedUsers}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create asset/i });
    expect(submitButton).toBeDisabled();
  });

  it('allows assigning an asset to a user', async () => {
    render(
      <AssetForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        assignedUsers={assignedUsers}
      />
    );

    // Fill required fields
    await user.type(screen.getByLabelText('Asset Name'), 'Test Asset');
    await user.type(screen.getByLabelText('Location'), 'Test Location');
    
    // Open the user dropdown
    await user.click(screen.getByLabelText('Assigned To'));
    
    // Select a user
    const userOption = await screen.findByText('John Doe');
    await user.click(userOption);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create asset/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedTo: '1', // John Doe's ID
        }),
        expect.anything()
      );
    });
  });
});
