'use client';

import { IMedia, ITag } from '@/app/(root)/docs/_types/types';
import { getSubcategoriesByCategory } from '@/app/(root)/docs/categories/[...categorySlug]/_services/services';
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
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { getAllCategories } from '../../manage-category/_services/services';
import { getAllTags } from '../../manage-tags/_services/services';
import { createMedia } from '../_services/services';
import RichTextEditor from './RichTextEditor';

export interface UpdateDocsFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  subcategoryId?: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  headerImageId?: IMedia | string;
  thumbnailId?: IMedia | string;
  isFeatured: any;
  tagIds: ITag[];
  mediaIds?: IMedia[] | string[];
  status?: 'archived' | 'draft' | 'published';
  headerImageUrl?: string;
  headerImageTitle?: string;
  thumbnailUrl?: string;
  thumbnailTitle?: string;
}

interface UpdateDocsFormProps {
  initialData: UpdateDocsFormData;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: UpdateDocsFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
}

const UpdateDocsForm: React.FC<UpdateDocsFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitText,
}) => {
  const form = useForm<UpdateDocsFormData>({ defaultValues: initialData });
  // eslint-disable-next-line no-unused-vars
  // const [categoryId, setCategoryId] = useState(initialData.categoryId || '');
  // const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [selectedHeaderFile, setSelectedHeaderFile] = useState<File | null>(
    null
  );
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Default fallback image ID
  const DEFAULT_IMAGE_ID = '687f2653dca2f17f9bf2bfb7';

  const {
    data: categoryData,
    // isLoading: isCategoriesLoading,
    // refetch: refetchCategory,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories({}),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const {
    data: tagData,
    // isLoading: isTagsLoading,
    // refetch: refetchTags,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getAllTags({}),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });
  const categories = categoryData?.categories ?? [];
  const tags = tagData?.tags ?? [];
  const watchedCategoryId = useWatch({
    control: form.control,
    name: 'categoryId',
  });

  const {
    data: subcategories = [],
    // isFetching: isSubcategoryLoading,
    // refetch: refetchSubcategory,
  } = useQuery({
    queryKey: ['subcategories', watchedCategoryId],
    queryFn: () => getSubcategoriesByCategory(watchedCategoryId!),
    enabled: !!watchedCategoryId, // only fetch when a category is selected
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
    select: (res) => res ?? [],
  });

  const prevCategoryIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      prevCategoryIdRef.current !== undefined &&
      prevCategoryIdRef.current !== watchedCategoryId
    ) {
      // Reset only when category changes (not on first mount)
      form.setValue('subcategoryId', '');
    }
    prevCategoryIdRef.current = watchedCategoryId;
  }, [watchedCategoryId, form]);

  const handleSubmit = (data: UpdateDocsFormData) => {
    // Apply fallback logic (similar to CreateDocsForm)
    const processedData = {
      ...data,
      // If metaTitle is empty/undefined, use title
      metaTitle: data.metaTitle?.trim() || data.title,
      // If metaDescription is empty/undefined, use excerpt
      metaDescription: data.metaDescription?.trim() || data.excerpt,
      // Handle image fallback logic
      headerImageId: data.headerImageId || DEFAULT_IMAGE_ID,
      thumbnailId: data.thumbnailId || data.headerImageId || DEFAULT_IMAGE_ID,
      isFeatured: data.isFeatured === 'true',
      // Handle optional fields - remove empty strings and convert to undefined
      slug: data.slug?.trim() || undefined,
      subcategoryId: data.subcategoryId || undefined,
    };

    onSubmit(processedData);
  };

  const headerInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [headerImagePreview, setHeaderImagePreview] = useState<{
    url: string;
    title?: string;
  } | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<{
    url: string;
    title?: string;
  } | null>(null);

  // Initialize preview with existing images
  useEffect(() => {
    if (
      initialData.headerImageId &&
      typeof initialData.headerImageId !== 'string'
    ) {
      setHeaderImagePreview({
        url: initialData.headerImageId.url,
        title: initialData.headerImageId.title || 'Header Image',
      });
    } else if (initialData.headerImageUrl) {
      setHeaderImagePreview({
        url: initialData.headerImageUrl,
        title: initialData.headerImageTitle || 'Header Image',
      });
    }

    if (
      initialData.thumbnailId &&
      typeof initialData.thumbnailId !== 'string'
    ) {
      setThumbnailPreview({
        url: initialData.thumbnailId.url,
        title: initialData.thumbnailId.title || 'Thumbnail',
      });
    } else if (initialData.thumbnailUrl) {
      setThumbnailPreview({
        url: initialData.thumbnailUrl,
        title: initialData.thumbnailTitle || 'Thumbnail',
      });
    }
  }, [initialData]);

  const handleFileUpload = async (
    fieldName: 'headerImageId' | 'thumbnailId'
  ) => {
    const file =
      fieldName === 'headerImageId'
        ? selectedHeaderFile
        : selectedThumbnailFile;
    if (!file) return;

    try {
      const uploaded = await createMedia([file]);
      if (uploaded?._id) {
        form.setValue(fieldName, uploaded._id, { shouldValidate: true });
        // Update preview with uploaded URL
        if (fieldName === 'headerImageId') {
          setHeaderImagePreview({
            url: uploaded.url,
            title: uploaded.title,
          });
          setSelectedHeaderFile(null);
        } else {
          setThumbnailPreview({
            url: uploaded.url,
            title: uploaded.title,
          });
          setSelectedThumbnailFile(null);
        }
        toast.success('File uploaded successfully!');
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Failed to upload file');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        {/* Title & Slug */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='title'
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Title' {...field} />
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
                message: 'Slug must be lowercase with hyphens',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (Optional)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder='e.g., some-slug (optional)'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category and Subcategory */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='categoryId'
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='h-9 w-full justify-between'
                        type='button'
                      >
                        {categories.find((c) => c._id === field.value)?.name ||
                          'Select category...'}
                        <ChevronsUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-full p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Search categories...'
                        value={categorySearch}
                        onValueChange={setCategorySearch}
                      />
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categories
                            .filter((cat) =>
                              cat.name
                                .toLowerCase()
                                .includes(categorySearch.toLowerCase())
                            )
                            .map((cat) => (
                              <CommandItem
                                key={cat._id}
                                // onClick={() => {
                                //   setCategoryId(cat._id);
                                // }}
                                onSelect={() => {
                                  field.onChange(cat._id);
                                  setCategoryOpen(false);
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
            name='subcategoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory (Optional)</FormLabel>
                <Popover
                  open={subcategoryOpen}
                  onOpenChange={setSubcategoryOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='h-9 w-full justify-between'
                        type='button'
                        disabled={!form.watch('categoryId') || isLoading}
                      >
                        {form.watch('categoryId')
                          ? subcategories.find((s) => s._id === field.value)
                              ?.name || 'Select subcategory (optional)...'
                          : 'Select category first'}
                        <ChevronsUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-full p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Search subcategories...'
                        value={subcategorySearch}
                        onValueChange={setSubcategorySearch}
                        disabled={!form.watch('categoryId') || isLoading}
                      />
                      <CommandEmpty>
                        {!form.watch('categoryId')
                          ? 'Select a category first.'
                          : 'No subcategories found.'}
                      </CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {form.watch('categoryId') && (
                            <CommandItem
                              onSelect={() => {
                                field.onChange('');
                                setSubcategoryOpen(false);
                              }}
                            >
                              <span className='text-muted-foreground'>
                                None (optional)
                              </span>
                            </CommandItem>
                          )}
                          {form.watch('categoryId') &&
                            subcategories
                              .filter((sub) =>
                                sub.name
                                  .toLowerCase()
                                  .includes(subcategorySearch.toLowerCase())
                              )
                              .map((sub) => (
                                <CommandItem
                                  key={sub._id}
                                  onSelect={() => {
                                    field.onChange(sub._id);
                                    setSubcategoryOpen(false);
                                  }}
                                >
                                  {sub.name}
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
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='metaTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title (Optional)</FormLabel>
                <Input
                  placeholder='Meta title (will use title if empty)'
                  {...field}
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tagIds'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='flex h-9 w-full flex-wrap justify-between'
                          type='button'
                        >
                          <div className='flex flex-wrap gap-1'>
                            {field.value && field.value.length > 0 ? (
                              tags
                                .filter((tag) =>
                                  field.value.some(
                                    (t: any) => t._id === tag._id
                                  )
                                )
                                .map((tag) => (
                                  <span
                                    key={tag._id}
                                    className='flex items-center rounded bg-muted px-2 py-0.5 text-xs'
                                  >
                                    {tag.name}
                                    <span
                                      className='ml-1 text-muted-foreground hover:text-destructive'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(
                                          field.value.filter(
                                            (t: any) => t._id !== tag._id
                                          )
                                        );
                                      }}
                                      tabIndex={-1}
                                    >
                                      ×
                                    </span>
                                  </span>
                                ))
                            ) : (
                              <span className='text-muted-foreground'>
                                Select tags...
                              </span>
                            )}
                          </div>
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Search tags...' />
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {tags.map((tag) => {
                              const isSelected = field.value?.some(
                                (t: any) => t._id === tag._id
                              );

                              return (
                                <CommandItem
                                  key={tag._id}
                                  onSelect={() => {
                                    if (isSelected) {
                                      // Remove tag (object)
                                      field.onChange(
                                        field.value.filter(
                                          (t: any) => t._id !== tag._id
                                        )
                                      );
                                    } else if ((field.value?.length || 0) < 5) {
                                      // Add tag (object)
                                      field.onChange([
                                        ...(field.value || []),
                                        tag,
                                      ]);
                                    } else {
                                      toast.info(
                                        'You can only select up to 5 tags.'
                                      );
                                    }
                                  }}
                                >
                                  <span
                                    className={
                                      isSelected
                                        ? 'font-semibold text-primary'
                                        : ''
                                    }
                                  >
                                    {tag.name}
                                  </span>
                                  {isSelected && (
                                    <span className='ml-auto text-primary'>
                                      ✓
                                    </span>
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Excerpt and Meta Description */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='excerpt'
            rules={{
              required: 'Excerpt is required',
              minLength: {
                value: 10,
                message: 'Excerpt must be at least 10 characters',
              },
              maxLength: {
                value: 160,
                message: 'Excerpt should be under 160 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <Textarea
                  placeholder='Enter description...'
                  {...field}
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='metaDescription'
            rules={{
              minLength: {
                value: 10,
                message: 'Meta Description must be at least 10 characters',
              },
              maxLength: {
                value: 160,
                message: 'Meta Description should be under 160 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description (Optional)</FormLabel>
                <Textarea
                  placeholder='Meta description (will use excerpt if empty)'
                  {...field}
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Media Upload */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='headerImageId'
            render={() => (
              <FormItem>
                <FormLabel>Header Image (Optional)</FormLabel>
                <div className='space-y-3'>
                  {/* File Selection Area */}
                  <div
                    className='flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted/75'
                    onClick={() => headerInputRef.current?.click()}
                  >
                    <div className='text-center'>
                      <div className='text-sm text-muted-foreground'>
                        Click to choose header image (optional)
                      </div>
                      <div className='text-xs text-muted-foreground/75'>
                        image, jpeg, video, mp4 up to 1 MB
                      </div>
                    </div>
                  </div>

                  <input
                    type='file'
                    accept='image/*'
                    ref={headerInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedHeaderFile(file);
                        // Create preview URL
                        const previewUrl = URL.createObjectURL(file);
                        setHeaderImagePreview({
                          url: previewUrl,
                          title: file.name,
                        });
                      }
                    }}
                    disabled={isLoading}
                  />

                  {/* Current/selected file info and upload button */}
                  {headerImagePreview?.url && (
                    <div className='space-y-2'>
                      <div className='flex flex-wrap items-center justify-between gap-4 rounded-lg border p-3'>
                        <div className='flex flex-wrap items-center justify-start gap-2'>
                          <Image
                            src={headerImagePreview.url}
                            alt='Header preview'
                            width={60}
                            height={60}
                            className='h-15 w-15 rounded object-cover'
                          />
                          <div className='flex-1'>
                            <div className='text-xs font-medium lg:text-sm'>
                              {headerImagePreview.title}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {selectedHeaderFile
                                ? 'Ready to upload'
                                : 'Current header image'}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {selectedHeaderFile && (
                            <Button
                              type='button'
                              size='sm'
                              onClick={() => handleFileUpload('headerImageId')}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Uploading...' : 'Upload'}
                            </Button>
                          )}
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            onClick={() => {
                              if (selectedHeaderFile) {
                                // If there's a selected file, just clear it and revert to original
                                setSelectedHeaderFile(null);
                                if (initialData.headerImageUrl) {
                                  setHeaderImagePreview({
                                    url: initialData.headerImageUrl,
                                    title:
                                      initialData.headerImageTitle ||
                                      'Header Image',
                                  });
                                } else if (
                                  initialData.headerImageId &&
                                  typeof initialData.headerImageId !== 'string'
                                ) {
                                  setHeaderImagePreview({
                                    url: initialData.headerImageId.url,
                                    title:
                                      initialData.headerImageId.title ||
                                      'Header Image',
                                  });
                                } else {
                                  setHeaderImagePreview(null);
                                }
                              } else {
                                // If no selected file, clear everything
                                setHeaderImagePreview(null);
                              }
                              if (headerInputRef.current) {
                                headerInputRef.current.value = '';
                              }
                            }}
                          >
                            {selectedHeaderFile ? 'Cancel' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='thumbnailId'
            render={() => (
              <FormItem>
                <FormLabel>Thumbnail (Optional)</FormLabel>
                <div className='space-y-3'>
                  {/* File Selection Area */}
                  <div
                    className='flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted/75'
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <div className='text-center'>
                      <div className='text-sm text-muted-foreground'>
                        Click to choose thumbnail (optional)
                      </div>
                      <div className='text-xs text-muted-foreground/75'>
                        image, jpeg, video, mp4 up to 1 MB
                      </div>
                    </div>
                  </div>

                  <input
                    type='file'
                    accept='image/*'
                    ref={thumbnailInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedThumbnailFile(file);
                        // Create preview URL
                        const previewUrl = URL.createObjectURL(file);
                        setThumbnailPreview({
                          url: previewUrl,
                          title: file.name,
                        });
                      }
                    }}
                    disabled={isLoading}
                  />

                  {/* Current/selected file info and upload button */}
                  {thumbnailPreview?.url && (
                    <div className='space-y-2'>
                      <div className='flex flex-wrap items-center justify-between gap-4 rounded-lg border p-3'>
                        <div className='flex flex-wrap items-center justify-start gap-2'>
                          <Image
                            src={thumbnailPreview.url}
                            alt='Thumbnail preview'
                            width={60}
                            height={60}
                            className='h-15 w-15 rounded object-cover'
                          />
                          <div className='flex-1'>
                            <div className='w-full truncate text-xs font-medium lg:text-sm'>
                              {thumbnailPreview.title}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {selectedThumbnailFile
                                ? 'Ready to upload'
                                : 'Current thumbnail'}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {selectedThumbnailFile && (
                            <Button
                              type='button'
                              size='sm'
                              onClick={() => handleFileUpload('thumbnailId')}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Uploading...' : 'Upload'}
                            </Button>
                          )}
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            onClick={() => {
                              if (selectedThumbnailFile) {
                                // If there's a selected file, just clear it and revert to original
                                setSelectedThumbnailFile(null);
                                if (initialData.thumbnailUrl) {
                                  setThumbnailPreview({
                                    url: initialData.thumbnailUrl,
                                    title:
                                      initialData.thumbnailTitle || 'Thumbnail',
                                  });
                                } else if (
                                  initialData.thumbnailId &&
                                  typeof initialData.thumbnailId !== 'string'
                                ) {
                                  setThumbnailPreview({
                                    url: initialData.thumbnailId.url,
                                    title:
                                      initialData.thumbnailId.title ||
                                      'Thumbnail',
                                  });
                                } else {
                                  setThumbnailPreview(null);
                                }
                              } else {
                                // If no selected file, clear everything
                                setThumbnailPreview(null);
                              }
                              if (thumbnailInputRef.current) {
                                thumbnailInputRef.current.value = '';
                              }
                            }}
                          >
                            {selectedThumbnailFile ? 'Cancel' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status + isFeatured */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className='h-9 w-full rounded border'
                    disabled={isLoading}
                  >
                    <option value='published'>Published</option>
                    <option value='draft'>Draft</option>
                    <option value='archived'>Archived</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isFeatured'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className='h-9 w-full rounded border'
                    disabled={isLoading}
                  >
                    <option value='true'>True</option>
                    <option value='false'>False</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Content Editor */}
        <FormField
          control={form.control}
          name='content'
          rules={{ required: 'Content is required' }}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder='Enter content...'
                disabled={isLoading}
                error={!!fieldState.error}
                minHeight='300px'
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={`flex justify-end space-x-3 pt-4 ${isFullScreen ? 'hidden' : ''}`}
        >
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

export default UpdateDocsForm;
