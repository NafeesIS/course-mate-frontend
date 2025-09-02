'use client';

import { getSubcategoriesByCategory } from '@/app/(root)/docs/categories/[...categorySlug]/_services/services';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ChevronsUpDown, Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FcPlus } from 'react-icons/fc';
import { toast } from 'sonner';
// import { useConfirmUnsavedContent } from '../../create-docs/_hooks/useConfirmUnsavedContent';
import RichTextEditor from '../../docs-list/_components/RichTextEditor';
import { createMedia } from '../../docs-list/_services/services';
import { CategoryFormData } from '../../manage-category/_components/CategoryForm';
import CreateCategoryDialog from '../../manage-category/_components/CreateCategoryDialog';
import {
  createCategory,
  getAllCategories,
} from '../../manage-category/_services/services';
import CreateSubcategoryDialog from '../../manage-subcategory/_components/CreateSubcategoryDialog';
import { SubcategoryFormData } from '../../manage-subcategory/_components/SubcategoryForm';
import { createSubcategory } from '../../manage-subcategory/_services/services';
import CreateTagDialog from '../../manage-tags/_components/CreateTagDialog';
import { RequiredLabel } from '../../manage-tags/_components/TagForm';
import { createTag, getAllTags } from '../../manage-tags/_services/services';
import { TagFormData } from '../../manage-tags/_types/types';
import { CreateDocsFormData, CreateDocsFormProps } from '../_types/types';

const CreateDocsForm: React.FC<CreateDocsFormProps> = ({
  initialData = {
    title: '',
    slug: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    content: '',
    categoryId: '',
    headerImageId: '',
    isFeatured: false,
    tagIds: [],
  },
  onSubmit,
  // onCancel,
  isLoading,
  submitText,
  resetSignal,
}) => {
  const form = useForm<CreateDocsFormData>({ defaultValues: initialData });
  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  // const [fileUploaded, setFileUploaded] = useState(false);
  const [selectedHeaderFile, setSelectedHeaderFile] = useState<File | null>(
    null
  );
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);
  const [createSubcategoryDialogOpen, setCreateSubcategoryDialogOpen] =
    useState(false);
  const [createTagDialogOpen, setCreateTagDialogOpen] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  // const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  // const [leaveDialogOpen, setLeaveDialogOpen] = useState(false); // UI for pendingHref

  // Default fallback image ID
  const DEFAULT_IMAGE_ID = '687f2653dca2f17f9bf2bfb7';

  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
    refetch: refetchCategory,
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
    isLoading: isTagsLoading,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getAllTags({}),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  // If you still want local state
  const categories = categoryData?.categories ?? [];
  const tags = tagData?.tags ?? [];
  const watchedCategoryId = useWatch({
    control: form.control,
    name: 'categoryId',
  });
  useEffect(() => {
    if (!form.getValues('status')) {
      form.setValue('status', 'draft', { shouldDirty: false });
    }
  }, [form]);
  const watchedStatus = form.watch('status');
  const watchedCategory = form.watch('categoryId');
  // WATCH ONLY THE CONTENT FIELD (as you asked)
  // const content = useWatch({ control: form.control, name: 'content' });

  // Detect if content actually has meaningful text (strip HTML & whitespace)
  // const hasMeaningfulContent = (() => {
  //   if (!content) return false;
  //   const noHtml = String(content)
  //     .replace(/<[^>]+>/g, '')
  //     .replace(/&nbsp;/g, ' ')
  //     .trim();
  //   return noHtml.length > 0;
  // })();

  // Unsaved changes guard
  // const { pendingHref, confirmLeave, cancelLeave } = useConfirmUnsavedContent({
  //   shouldPrompt: hasMeaningfulContent,
  // });

  // show/hide leave dialog when hook reports a pending nav
  // useEffect(() => {
  //   setLeaveDialogOpen(Boolean(pendingHref));
  // }, [pendingHref]);

  const {
    data: subcategories = [],
    isFetching: isSubcategoryLoading,
    refetch: refetchSubcategory,
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

  const handleSubmit = async (data: CreateDocsFormData) => {
    try {
      const [headerUpload, thumbUpload] = await Promise.all([
        selectedHeaderFile
          ? createMedia([selectedHeaderFile])
          : Promise.resolve(null),
        selectedThumbnailFile
          ? createMedia([selectedThumbnailFile])
          : Promise.resolve(null),
      ]);

      // Resolve final IDs (preserve already-set IDs if no new file chosen)
      const resolvedHeaderId = headerUpload?._id || data.headerImageId || '';
      const resolvedThumbId = thumbUpload?._id || data.thumbnailId || '';

      // Update previews from server URLs if uploads happened (nice UX on return)
      if (headerUpload?.url) {
        setHeaderImagePreview({
          url: headerUpload.url,
          title: headerUpload.title,
        });
      }
      if (thumbUpload?.url) {
        setThumbnailPreview({ url: thumbUpload.url, title: thumbUpload.title });
      }

      // Apply fallback logic
      const processedData = {
        ...data,
        // If metaTitle is empty/undefined, use title
        metaTitle: data.metaTitle?.trim() || data.title,
        // If metaDescription is empty/undefined, use excerpt
        metaDescription: data.metaDescription?.trim() || data.excerpt,
        // Handle image fallback logic
        headerImageId:
          resolvedHeaderId || data.headerImageId || DEFAULT_IMAGE_ID,
        thumbnailId:
          resolvedThumbId ||
          data.thumbnailId ||
          resolvedHeaderId ||
          data.headerImageId ||
          DEFAULT_IMAGE_ID,
        // Handle optional fields - remove empty strings and convert to undefined
        isFeatured: Boolean(isFeatured),
        slug: data.slug?.trim() || undefined,
        subcategoryId: data.subcategoryId || undefined,
      };

      onSubmit(processedData);
    } catch (err) {
      toast.error(`${err}`);
    }
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

  // Update preview when initialData changes (for edit mode)
  useEffect(() => {
    // If you want to support editing with preview, you need to pass the preview url in initialData
    if ((initialData as any).headerImageUrl) {
      setHeaderImagePreview({
        url: (initialData as any).headerImageUrl,
        title: (initialData as any).headerImageTitle,
      });
    }
    if ((initialData as any).thumbnailUrl) {
      setThumbnailPreview({
        url: (initialData as any).thumbnailUrl,
        title: (initialData as any).thumbnailTitle,
      });
    }
  }, [initialData]);

  // Handler functions
  const handleCreateSubcategory = async (formData: SubcategoryFormData) => {
    try {
      await createSubcategory(formData);
      toast.success('Subcategory created successfully!');
      setCreateSubcategoryDialogOpen(false);
      refetchSubcategory();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create subcategory. Please try again.';
      toast.error(message);
    }
  };

  const handleCreateCategory = async (formData: CategoryFormData) => {
    try {
      await createCategory(formData);
      toast.success('Category created successfully!');
      setCreateCategoryDialogOpen(false);
      refetchCategory();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create category. Please try again.';
      toast.error(message);
    }
  };

  const handleCreateTag = async (data: TagFormData) => {
    try {
      await createTag(data.name, data.slug);
      toast.success('Tag created successfully!');
      setCreateTagDialogOpen(false);
      refetchTags();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create tag. Please try again.');
      }
    }
  };

  return (
    <>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 xs:gap-4'>
        <h1 className='text-base font-semibold xs:text-lg md:text-2xl xl:mb-6 xl:text-3xl'>
          Create Docs
        </h1>

        <div className='flex items-center gap-2'>
          <Checkbox
            checked={isFeatured}
            onCheckedChange={(val) => setIsFeatured(Boolean(val))}
            disabled={isLoading}
          />
          <span className='text-xs font-medium md:text-sm'>Featured</span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          {/* Title & Slug */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              rules={{
                validate: (value) => {
                  if (watchedStatus !== 'draft' && !value?.trim()) {
                    return 'Title is required';
                  }
                  if (value.length < 5) {
                    return 'Title must be at least 5 characters';
                  }
                  if (value.length > 160) {
                    return 'Title should be under 150 characters';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel>Title</RequiredLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Title'
                      className='h-10'
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
              rules={{
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: 'Slug must be lowercase with hyphens',
                },
              }}
              render={({ field }) => (
                <FormItem className='flex flex-col items-start justify-start gap-2.5'>
                  <FormLabel className='flex translate-y-1 items-center justify-start gap-1.5'>
                    <span> Slug (Optional)</span>{' '}
                    <div className='group relative'>
                      <button
                        className='flex-center rounded-full'
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                        }}
                      >
                        <Info className='h-3 w-3' />
                      </button>

                      <span className='absolute left-0 top-[calc(100%+10px)] z-10 hidden w-52 rounded-lg border bg-white p-3 text-[10px] leading-relaxed text-slate-600 shadow-md group-hover:block'>
                        The URL-friendly version of your title. It usually
                        contains only lowercase letters, numbers, and hyphens
                        (e.g., your-article-title).
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='e.g., some-slug (optional)'
                      className='h-10'
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
              rules={{
                validate: (value) => {
                  if (watchedStatus !== 'draft' && !value?.trim()) {
                    return 'Category is required';
                  }
                  if (
                    watchedStatus !== 'draft' &&
                    watchedCategory === '68a19bb4b09c3b367367f7bc'
                  ) {
                    return 'Draft Category should not publish';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel>Category</RequiredLabel>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='h-10 w-full justify-between'
                          type='button'
                        >
                          {categories.find((c) => c._id === field.value)
                            ?.name || 'Select category...'}
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
                        <CommandEmpty className='flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm'>
                          <span className='mb-0.5 mt-2'>
                            No categories found.
                          </span>
                          <Button
                            variant={'outline'}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent form submission
                              setCreateCategoryDialogOpen(true);
                            }}
                            className='h-9 w-full rounded-none duration-200 hover:bg-slate-200'
                          >
                            <FcPlus className='mr-2 h-5 w-5' />
                            Category
                          </Button>
                        </CommandEmpty>
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
                            <CommandItem>
                              <Button
                                variant={'outline'}
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission
                                  setCreateCategoryDialogOpen(true);
                                }}
                                className='h-9 w-full duration-200 hover:bg-slate-200'
                              >
                                <FcPlus className='mr-2 h-5 w-5' />
                                Category
                              </Button>
                            </CommandItem>
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
                          className='h-10 w-full justify-between'
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
                        <CommandEmpty className='py-0'>
                          {!form.watch('categoryId') ? (
                            'Select a category first.'
                          ) : (
                            <span className='flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm'>
                              <span className='mb-0.5 mt-2'>
                                No subcategories found.
                              </span>
                              <Button
                                variant='outline'
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission
                                  setCreateSubcategoryDialogOpen(true);
                                }}
                                className='h-9 w-full rounded-none duration-200 hover:bg-slate-200'
                              >
                                <FcPlus className='mr-2 h-5 w-5' />
                                Subcategory
                              </Button>
                            </span>
                          )}
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
                            <CommandItem>
                              {' '}
                              <Button
                                variant='outline'
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission
                                  setCreateSubcategoryDialogOpen(true);
                                }}
                                className='h-9 w-full rounded-none duration-200 hover:bg-slate-200'
                              >
                                <FcPlus className='mr-2 h-5 w-5' />
                                Subcategory
                              </Button>
                            </CommandItem>
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
                <FormItem className='flex flex-col items-start justify-start gap-2.5'>
                  <FormLabel className='flex translate-y-1 items-center justify-start gap-1.5'>
                    <span> Meta Title (Optional)</span>{' '}
                    <div className='group relative'>
                      <button
                        className='flex-center rounded-full'
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                        }}
                      >
                        <Info className='h-3 w-3' />
                      </button>

                      <span className='absolute left-0 top-[calc(100%+10px)] z-10 hidden w-52 rounded-lg border bg-white p-3 text-[10px] leading-relaxed text-slate-600 shadow-md group-hover:block'>
                        The title that appears in search engine results and
                        browser tabs. Keep it concise and relevant to your
                        content.
                      </span>
                    </div>
                  </FormLabel>
                  <Input
                    placeholder='Meta title (will use title if empty)'
                    className='h-10'
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
              rules={{
                validate: (value: string[] | undefined) => {
                  const len = value?.length ?? 0;

                  // Always enforce max 5
                  if (len > 5) return 'You can select up to 5 tags.';

                  // Required only when not draft
                  if (watchedStatus !== 'draft' && len === 0)
                    return 'At least one tag is required.';

                  return true;
                },
              }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <RequiredLabel>Tags</RequiredLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className='flex h-auto min-h-10 w-full justify-between gap-2'
                            type='button'
                          >
                            <div className='flex flex-wrap gap-1.5'>
                              {field.value && field.value.length > 0 ? (
                                tags
                                  .filter((tag) =>
                                    field.value.includes(tag._id)
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
                                              (id: string) => id !== tag._id
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
                          <CommandEmpty className='flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm'>
                            <span className='mb-0.5 mt-2'>No tags found.</span>
                            <Button
                              variant={'outline'}
                              onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                setCreateTagDialogOpen(true); // Open the create tag dialog
                              }}
                              className='h-9 w-full rounded-none duration-200 hover:bg-slate-200'
                            >
                              <FcPlus className='mr-2 h-5 w-5' />
                              Tag
                            </Button>
                          </CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {tags.map((tag) => (
                                <CommandItem
                                  key={tag._id}
                                  onSelect={() => {
                                    if (field.value?.includes(tag._id)) {
                                      // Remove tag
                                      field.onChange(
                                        field.value.filter(
                                          (id: string) => id !== tag._id
                                        )
                                      );
                                    } else if ((field.value?.length || 0) < 5) {
                                      // Add tag only if less than 5 are selected
                                      field.onChange([
                                        ...(field.value || []),
                                        tag._id,
                                      ]);
                                    } else {
                                      // Optionally, show a toast or message
                                      toast.info(
                                        'You can only select up to 5 tags.'
                                      );
                                    }
                                  }}
                                >
                                  <span
                                    className={
                                      field.value?.includes(tag._id)
                                        ? 'font-semibold text-primary'
                                        : ''
                                    }
                                  >
                                    {tag.name}
                                  </span>
                                  {field.value?.includes(tag._id) && (
                                    <span className='ml-auto text-primary'>
                                      ✓
                                    </span>
                                  )}
                                </CommandItem>
                              ))}
                              <CommandItem>
                                {' '}
                                <Button
                                  variant='outline'
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setCreateTagDialogOpen(true);
                                  }}
                                  className='h-9 w-full rounded-none duration-200 hover:bg-slate-200'
                                >
                                  <FcPlus className='mr-2 h-5 w-5' />
                                  Tag
                                </Button>
                              </CommandItem>
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
          {/* Excerpt, Meta Title, Meta Description */}

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='excerpt'
              rules={{
                validate: (value) => {
                  if (watchedStatus === 'draft') {
                    return true; // skip validation
                  }
                  if (!value?.trim()) {
                    return 'Excerpt is required';
                  }
                  if (value.length < 10) {
                    return 'Excerpt must be at least 10 characters';
                  }
                  if (value.length > 160) {
                    return 'Excerpt should be under 160 characters';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel>Excerpt</RequiredLabel>
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
                <FormItem className='flex flex-col items-start justify-start gap-2.5'>
                  <FormLabel className='flex translate-y-1 items-center justify-start gap-1.5'>
                    <span> Meta Description (Optional)</span>{' '}
                    <div className='group relative'>
                      <button
                        className='flex-center rounded-full'
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                        }}
                      >
                        <Info className='h-3 w-3' />
                      </button>

                      <span className='absolute left-0 top-[calc(100%+10px)] z-10 hidden w-52 max-w-52 rounded-lg border bg-white p-3 text-[10px] leading-relaxed text-slate-600 shadow-md group-hover:block'>
                        A short summary of your page that appears in search
                        engine results. Aim for 150-160 characters to encourage
                        clicks
                      </span>
                    </div>
                  </FormLabel>
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
                        <div className='text-[10px] text-muted-foreground/75 lg:text-xs'>
                          Recommended:{' '}
                          <span className='font-medium'>1200x600px</span>, Image
                          up to 1 MB.
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

                    {/* Selected file info and upload button */}
                    {headerImagePreview?.url && (
                      <div className='space-y-2'>
                        <div className='no-visible-scrollbar flex flex-wrap items-center justify-between gap-4 overflow-x-scroll rounded-lg border p-3'>
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
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                              onClick={() => {
                                setHeaderImagePreview(null);
                                setSelectedHeaderFile(null);
                                if (headerInputRef.current) {
                                  headerInputRef.current.value = '';
                                }
                              }}
                            >
                              Remove
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
                        <div className='text-[10px] text-muted-foreground/75 lg:text-xs'>
                          Recommended:{' '}
                          <span className='font-medium'>600x400px</span>, Image
                          up to 1 MB.
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

                    {/* Selected file info and upload button */}
                    {thumbnailPreview?.url && (
                      <div className='space-y-2'>
                        <div className='no-visible-scrollbar flex flex-wrap items-center justify-between gap-4 space-x-3 overflow-x-scroll rounded-lg border p-3'>
                          <div className='flex flex-wrap items-center justify-start gap-2'>
                            <Image
                              src={thumbnailPreview.url}
                              alt='Thumbnail preview'
                              width={60}
                              height={60}
                              className='h-15 w-15 rounded object-cover'
                            />
                            <div className='flex-1'>
                              <div className='text-xs font-medium lg:text-sm'>
                                {thumbnailPreview.title}
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                              onClick={() => {
                                setThumbnailPreview(null);
                                setSelectedThumbnailFile(null);
                                if (thumbnailInputRef.current) {
                                  thumbnailInputRef.current.value = '';
                                }
                              }}
                            >
                              Remove
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
          {/* Content Editor with Rich Text Editor */}
          <FormField
            control={form.control}
            name='content'
            rules={{
              validate: (value) => {
                if (watchedStatus !== 'draft' && !value?.trim()) {
                  return 'Content is required';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`flex flex-wrap justify-end gap-2 pt-4 ${isFullScreen ? 'hidden' : ''}`}
          >
            {/* <Button
              type='button'
              variant='outline'
              onClick={() => handleClear}
              disabled={isLoading}
            >
              Clear
            </Button> */}

            {/* Dialog: Confirm clearing fields */}
            {/* <AlertDialog
              open={confirmClearOpen}
              onOpenChange={setConfirmClearOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all fields?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved content. Clearing will remove everything
                    you’ve typed on this page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmClearOpen(false)}>
                    Keep editing
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setConfirmClearOpen(false);
                      doClear();
                    }}
                  >
                    Clear anyway
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}

            {/* Dialog: Confirm leaving page with unsaved content */}
            {/* <AlertDialog
              open={leaveDialogOpen}
              onOpenChange={(open) => (open ? null : cancelLeave())}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this page?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. If you leave now, your edits will
                    be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={cancelLeave}>
                    Stay
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmLeave}>
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
            {/* Save as Draft */}
            <Button
              type='button'
              variant='secondary'
              disabled={isLoading}
              onClick={() => {
                form.setValue('status', 'draft', {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.handleSubmit(handleSubmit)();
              }}
            >
              {isLoading ? 'Saving…' : 'Save as Draft'}
            </Button>

            {/* Publish */}
            <Button
              type='button'
              disabled={isLoading}
              onClick={() => {
                form.setValue('status', 'published', {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.handleSubmit(handleSubmit)();
              }}
            >
              {isLoading ? 'Publishing…' : submitText}
            </Button>
          </div>
        </form>
      </Form>
      {/* Dialogs */}
      <CreateCategoryDialog
        isOpen={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        onSubmit={handleCreateCategory}
        isLoading={isCategoriesLoading}
      />

      <CreateSubcategoryDialog
        categoryId={watchedCategoryId}
        isOpen={createSubcategoryDialogOpen}
        onClose={() => setCreateSubcategoryDialogOpen(false)}
        onSubmit={handleCreateSubcategory}
        isLoading={isSubcategoryLoading}
      />

      <CreateTagDialog
        isOpen={createTagDialogOpen}
        onClose={() => setCreateTagDialogOpen(false)}
        onSubmit={handleCreateTag}
        isLoading={isTagsLoading}
      />
    </>
  );
};

export default CreateDocsForm;
