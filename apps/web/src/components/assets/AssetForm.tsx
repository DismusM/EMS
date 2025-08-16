import { useState, useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { 
  TextInput, 
  Textarea, 
  Select, 
  NumberInput, 
  Button, 
  Stack, 
  Box, 
  Group,
  MultiSelect,
  FileInput,
  Image,
  LoadingOverlay,
  Divider,
  Paper,
} from '@mantine/core';
import { z } from 'zod';
import { 
  Asset, 
  AssetStatus, 
  AssetType,
  MaintenancePriority,
  MaintenanceType,
} from '@ems/shared/types/asset';
import { DateInput } from '@mantine/dates';
import { useAuth } from '@/lib/auth';
import { assetService } from '@/lib/services/api';

// Define validation schema with zod
const assetSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  type: z.nativeEnum(AssetType, {
    errorMap: () => ({ message: 'Please select an asset type' }),
  }),
  status: z.nativeEnum(AssetStatus, {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  location: z.string().min(2, { message: 'Location is required' }),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  purchaseDate: z.date().optional(),
  purchasePrice: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
  maintenanceNotes: z.string().optional(),
  maintenanceType: z.nativeEnum(MaintenanceType, {
    errorMap: () => ({ message: 'Please select a maintenance type' }),
  }).optional(),
  maintenancePriority: z.nativeEnum(MaintenancePriority, {
    errorMap: () => ({ message: 'Please select a priority' }),
  }).optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  initialValues?: Partial<Asset>;
  onSubmit: (values: AssetFormValues) => Promise<void>;
  isSubmitting: boolean;
  isEdit?: boolean;
  assignedUsers?: Array<{ value: string; label: string }>;
}

export function AssetForm({
  initialValues = {
    name: '',
    type: AssetType.EQUIPMENT,
    status: AssetStatus.AVAILABLE,
    location: '',
    purchaseDate: new Date(),
    purchasePrice: 0,
    maintenancePriority: MaintenancePriority.MEDIUM,
  },
  onSubmit,
  isSubmitting,
  isEdit = false,
  assignedUsers = [],
}: AssetFormProps) {
  const [isClient, setIsClient] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<AssetFormValues>({
    initialValues: {
      name: '',
      type: AssetType.EQUIPMENT,
      status: AssetStatus.AVAILABLE,
      location: '',
      purchaseDate: new Date(),
      purchasePrice: 0,
      maintenancePriority: MaintenancePriority.MEDIUM,
      ...initialValues,
      // Convert string dates to Date objects if needed
      purchaseDate: initialValues.purchaseDate 
        ? new Date(initialValues.purchaseDate) 
        : new Date(),
    },
    validate: zodResolver(assetSchema),
  });

  // Set isClient to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      // In a real app, you would upload the file to your server here
      // const { url } = await assetService.uploadImage(file);
      // form.setFieldValue('imageUrl', url);
      // setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      <LoadingOverlay visible={isUploading} overlayBlur={2} />
      
      <Stack spacing="md">
        <Paper p="md" withBorder>
          <TextInput
            label="Asset Name"
            placeholder="Enter asset name"
            required
            {...form.getInputProps('name')}
          />
          
          <Group grow mt="md">
            <Select
              label="Type"
              placeholder="Select type"
              required
              data={Object.entries(AssetType).map(([key, value]) => ({
                value,
                label: key.replace(/_/g, ' '),
              }))}
              {...form.getInputProps('type')}
            />
            
            <Select
              label="Status"
              placeholder="Select status"
              required
              data={Object.entries(AssetStatus).map(([key, value]) => ({
                value,
                label: key.replace(/_/g, ' '),
              }))}
              {...form.getInputProps('status')}
            />
          </Group>
          
          <TextInput
            label="Location"
            placeholder="Enter location"
            required
            mt="md"
            {...form.getInputProps('location')}
          />
        </Paper>

        <Paper p="md" withBorder>
          <Text size="lg" weight={500} mb="md">Asset Details</Text>
          
          <Group grow>
            <TextInput
              label="Serial Number"
              placeholder="Enter serial number"
              {...form.getInputProps('serialNumber')}
            />
            
            <TextInput
              label="Model"
              placeholder="Enter model"
              {...form.getInputProps('model')}
            />
            
            <TextInput
              label="Manufacturer"
              placeholder="Enter manufacturer"
              {...form.getInputProps('manufacturer')}
            />
          </Group>
          
          <Group grow mt="md">
            <DateInput
              label="Purchase Date"
              placeholder="Select date"
              valueFormat="MM/DD/YYYY"
              {...form.getInputProps('purchaseDate')}
            />
            
            <NumberInput
              label="Purchase Price ($)"
              placeholder="Enter price"
              min={0}
              precision={2}
              {...form.getInputProps('purchasePrice')}
            />
          </Group>
          
          <Textarea
            label="Notes"
            placeholder="Enter any additional notes"
            mt="md"
            minRows={3}
            {...form.getInputProps('notes')}
          />
        </Paper>
        
        <Paper p="md" withBorder>
          <Text size="lg" weight={500} mb="md">Assignment</Text>
          
          <Select
            label="Assigned To"
            placeholder="Select user"
            clearable
            data={assignedUsers}
            {...form.getInputProps('assignedTo')}
          />
        </Paper>
        
        {isEdit && (
          <Paper p="md" withBorder>
            <Text size="lg" weight={500} mb="md">Maintenance</Text>
            
            <Group grow>
              <Select
                label="Maintenance Type"
                placeholder="Select type"
                data={Object.entries(MaintenanceType).map(([key, value]) => ({
                  value,
                  label: key.replace(/_/g, ' '),
                }))}
                {...form.getInputProps('maintenanceType')}
              />
              
              <Select
                label="Priority"
                placeholder="Select priority"
                data={Object.entries(MaintenancePriority).map(([key, value]) => ({
                  value,
                  label: key.charAt(0) + key.slice(1).toLowerCase(),
                }))}
                {...form.getInputProps('maintenancePriority')}
              />
            </Group>
            
            <Textarea
              label="Maintenance Notes"
              placeholder="Enter maintenance notes"
              mt="md"
              minRows={2}
              {...form.getInputProps('maintenanceNotes')}
            />
          </Paper>
        )}
        
        <Paper p="md" withBorder>
          <Text size="lg" weight={500} mb="md">Photos</Text>
          
          <FileInput
            label="Upload Image"
            placeholder="Select an image"
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          {imagePreview && (
            <Box mt="md">
              <Image 
                src={imagePreview} 
                alt="Asset preview" 
                width={200} 
                height={200}
                fit="contain"
              />
            </Box>
          )}
        </Paper>

        <Group position="right" mt="md">
          <Button 
            type="submit" 
            loading={isSubmitting}
            disabled={!form.isDirty()}
          >
            {isEdit ? 'Update Asset' : 'Create Asset'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
