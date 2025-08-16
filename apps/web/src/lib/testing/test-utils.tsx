import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/lib/auth';

// Create a custom render function that includes all necessary providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: MemoryRouterProps['initialEntries'];
    authState?: {
      isAuthenticated: boolean;
      user: any;
    };
  }
) => {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <MemoryRouter initialEntries={options?.initialEntries}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
// Override render method
export { customRender as render };

// Utility function to mock API responses
export const mockApiResponse = <T,>(
  data: T,
  options: {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
  } = {}
): Response => {
  const { status = 200, statusText = 'OK', headers = {} } = options;

  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

// Helper to generate mock user
export const mockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: Role.ADMIN,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to generate mock asset
export const mockAsset = (overrides: Partial<Asset> = {}): Asset => ({
  id: '1',
  name: 'Test Asset',
  type: AssetType.EQUIPMENT,
  status: AssetStatus.AVAILABLE,
  location: 'Test Location',
  purchaseDate: new Date().toISOString(),
  purchasePrice: 1000,
  serialNumber: 'SN12345',
  model: 'Test Model',
  manufacturer: 'Test Manufacturer',
  assignedTo: null,
  lastMaintenance: null,
  nextMaintenance: null,
  maintenanceHistory: [],
  notes: 'Test notes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to generate mock maintenance record
export const mockMaintenanceRecord = (
  overrides: Partial<MaintenanceRecord> = {}
): MaintenanceRecord => ({
  id: '1',
  assetId: '1',
  type: MaintenanceType.PREVENTIVE,
  title: 'Test Maintenance',
  description: 'Test maintenance description',
  status: 'completed',
  priority: MaintenancePriority.MEDIUM,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  cost: 100,
  technician: 'Test Technician',
  notes: 'Test notes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to generate paginated response
export const mockPaginatedResponse = <T,>(
  items: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } = {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  }
) => ({
  items,
  pagination: {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPreviousPage: pagination.page > 1,
  },
});

// Helper to wait for loading to finish
export const waitForLoadingToFinish = async (): Promise<void> => {
  await waitFor(
    () => {
      const loaders = document.querySelectorAll('.mantine-LoadingOverlay-root');
      loaders.forEach((loader) => {
        expect(loader).not.toBeInTheDocument();
      });
    },
    { timeout: 4000 }
  );
};

// Helper to test form validation
export const testFormValidation = async (
  form: HTMLElement,
  fields: Array<{
    name: string;
    value: string;
    error: string;
  }>
) => {
  for (const field of fields) {
    const input = within(form).getByRole('textbox', { name: field.name });
    await userEvent.clear(input);
    await userEvent.type(input, field.value);
    await userEvent.tab(); // Trigger blur
    
    // Check for error message
    const errorElement = await within(form).findByText(field.error);
    expect(errorElement).toBeInTheDocument();
  }
};
