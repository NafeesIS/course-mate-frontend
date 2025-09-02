'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllCategories } from '../../manage-category/_services/services';

export interface SubcategoryFormData {
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: 'active' | 'archived';
  categoryId: string; // keeping category required (business rule)
}

interface SubcategoryFormProps {
  initialData?: SubcategoryFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: SubcategoryFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
  isUpdateForm?: boolean;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center gap-1'>
    <FormLabel className='mb-0'>{children}</FormLabel>
    <span className='text-red-500' aria-hidden='true'>
      *
    </span>
  </div>
);

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  initialData = {
    name: '',
    slug: undefined,
    description: '',
    metaDescription: '',
    metaTitle: '',
    status: 'active',
    categoryId: '',
  },
  onSubmit,
  onCancel,
  isLoading,
  submitText,
  isUpdateForm = false,
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const form = useForm<SubcategoryFormData>({
    defaultValues: initialData,
  });

  const { data: allCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories({}),
    select: (res) => res?.categories || [],
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });
  const categories = (allCategories || []).filter(
    (cat) => cat._id.toString() !== '68a19bb4b09c3b367367f7bc'
  );
  const handleSubmit = (data: SubcategoryFormData) => {
    const payload: SubcategoryFormData = {
      ...data,
      categoryId:
        data.categoryId === undefined
          ? initialData.categoryId
          : data.categoryId,
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
                    placeholder='Enter subcategory name'
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
            // optional now
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
                    placeholder='enter-subcategory-slug'
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

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Category Selection (kept required) */}
          <FormField
            control={form.control}
            name='categoryId'
            disabled={isUpdateForm || initialData.categoryId !== ''}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <RequiredLabel>Category</RequiredLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    disabled={isUpdateForm || initialData.categoryId !== ''}
                    asChild
                  >
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        disabled={
                          isUpdateForm ||
                          isLoading ||
                          initialData.categoryId !== ''
                        }
                        aria-expanded={open}
                        className='h-9 w-full justify-between'
                      >
                        {!field.value ||
                        !Array.isArray(categories) ||
                        categories.length === 0
                          ? 'Select category...'
                          : categories?.find(
                              (category) => category._id === field.value
                            )?.name}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-full p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Search categories...'
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categories &&
                            Array.isArray(categories) &&
                            categories
                              .filter(
                                (cat) =>
                                  cat.name &&
                                  cat.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                              )
                              .map((cat) => (
                                <CommandItem
                                  key={cat._id}
                                  value={cat.name}
                                  onSelect={() => {
                                    field.onChange(cat._id);
                                    setOpen(false);
                                  }}
                                >
                                  {cat.name}
                                </CommandItem>
                              ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            // optional now
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status (optional)</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className='flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                    disabled={isLoading}
                  >
                    <option value='active'>Active</option>
                    <option value='archived'>Archived</option>
                  </select>
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
                  placeholder='Enter subcategory description'
                  className='min-h-[80px] resize-none'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEO fields in two columns for medium+ screens */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='metaTitle'
            // optional now
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
            // optional now
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

export default SubcategoryForm;
