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
import { useForm } from 'react-hook-form';
import { TagFormData, TagFormProps } from '../_types/types';

export const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center gap-1'>
    <FormLabel className='mb-0'>{children}</FormLabel>
    <span className='text-red-500' aria-hidden='true'>
      *
    </span>
  </div>
);

const TagForm: React.FC<TagFormProps> = ({
  initialData = { name: '', slug: undefined },
  onSubmit,
  onCancel,
  isLoading,
  submitText,
}) => {
  const form = useForm<TagFormData>({
    defaultValues: initialData,
  });

  const handleSubmit = (data: TagFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
                  placeholder='Enter tag name'
                  className='h-10'
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => {
                    // Remove all spaces from input value
                    const noSpaces = e.target.value.replace(/\s+/g, '');
                    field.onChange(noSpaces);
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
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
                  placeholder='enter-tag-slug'
                  className='h-10'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default TagForm;
