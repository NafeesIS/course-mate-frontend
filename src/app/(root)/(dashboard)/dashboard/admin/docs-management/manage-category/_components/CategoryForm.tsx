import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

export interface CategoryFormData {
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: 'active' | 'archived';
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center gap-1'>
    <FormLabel className='mb-0'>{children}</FormLabel>
    <span className='text-red-500' aria-hidden='true'>
      *
    </span>
  </div>
);

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData = {
    name: '',
    slug: undefined,
    description: '',
    metaDescription: '',
    metaTitle: '',
    status: 'active',
  },
  onSubmit,
  onCancel,
  isLoading,
  submitText,
}) => {
  const form = useForm<CategoryFormData>({
    defaultValues: initialData,
  });

  const handleSubmit = (data: CategoryFormData) => {
    const payload: CategoryFormData = {
      ...data,
      // fallbacks if empty/whitespace
      metaTitle: (data.metaTitle ?? '').trim() || data.name,
      metaDescription: (data.metaDescription ?? '').trim() || data.description,
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        {/* Two column layout for medium+ screens */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            rules={{
              required: 'Name is required',
              minLength: { value: 1, message: 'Name must not be empty' },
            }}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Name</RequiredLabel>
                <FormControl>
                  <Input
                    placeholder='Enter category name'
                    className='h-9'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            // slug is optional now — no `required`
            rules={{
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Slug must be lowercase with hyphens only',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='enter-category-slug'
                    className='h-9'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Full width fields */}
        <FormField
          control={form.control}
          name='description'
          rules={{
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            },
            maxLength: {
              value: 500,
              message: 'Description should be under 500 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Description</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter category description'
                  className='min-h-[80px] resize-none'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          // optional — remove `required`
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status (optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className='h-9'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEO fields in two columns for medium+ screens */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='metaTitle'
            // optional — remove `required`
            rules={{
              minLength: {
                value: 5,
                message: 'Meta title should be at least 5 characters',
              },
              maxLength: {
                value: 50,
                message:
                  'Meta title should be under 50 characters for better SEO',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter meta title for SEO'
                    className='h-9'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <div className='text-xs text-gray-500'>
                  {field.value?.length || 0}/50 characters
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='metaDescription'
            // optional — remove `required`
            rules={{
              minLength: {
                value: 10,
                message: 'Meta description should be at least 10 characters',
              },
              maxLength: {
                value: 150,
                message:
                  'Meta description should be under 150 characters for better SEO',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter meta description for SEO'
                    className='min-h-[60px] resize-none'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <div className='text-xs text-gray-500'>
                  {field.value?.length || 0}/150 characters
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Processing...' : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
