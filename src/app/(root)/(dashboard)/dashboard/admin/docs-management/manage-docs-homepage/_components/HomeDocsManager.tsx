'use client';

import type { Doc, ISubcategory } from '@/app/(root)/docs/_types/types';
import {
  getDocsByCategorySubcategory,
  getSubcategoriesByCategory,
} from '@/app/(root)/docs/categories/[...categorySlug]/_services/services';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  HelpCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FcPlus } from 'react-icons/fc';
import { toast } from 'sonner';
import DocsPagination from '../../docs-list/_components/DocsPagination';
import { updateDoc } from '../../docs-list/_services/services';
import DocumentCard from './DocumentCard';
import QuickStats from './QuickStats';
import SubcategoryManager from './SubcategoryManager';

export type DocWithHome = Doc & {
  homepageSection?: string | null;
};

// Constants
const HELP_CATEGORY_ID = '687df2029da08450ab8b8e60';
const PRODUCTS_CATEGORY_ID = '687df2029da08450ab8b8e61';

// Category configuration with better UX
const CATEGORY_CONFIG = {
  products: {
    id: 'products',
    label: 'Our Products',
    icon: Package,
    description: 'Product documentation and guides',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  featured: {
    id: 'featured',
    label: 'Featured',
    icon: Star,
    description: 'Highlighted articles and important content',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  help: {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
    description: 'Support documentation and FAQs',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
} as const;

export default function HomeDocsManager() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>(
    undefined
  );
  const [activeCategory, setActiveCategory] = useState<
    'products' | 'featured' | 'help'
  >('products');

  // Fetch subcategories for Products
  const {
    data: allSubcategories,
    isLoading: loadingSubcats,
    refetch: refetchSubcats,
  } = useQuery({
    queryKey: ['allSubcategories', PRODUCTS_CATEGORY_ID],
    queryFn: () => getSubcategoriesByCategory(PRODUCTS_CATEGORY_ID),
    enabled: activeCategory === 'products',
  });

  const subcategories = useMemo(() => {
    if (!allSubcategories) return [];
    return [...allSubcategories].sort((a, b) => {
      // put homepage=true first
      return (b.isHomepage ? 1 : 0) - (a.isHomepage ? 1 : 0);
    });
  }, [allSubcategories]);

  // Auto-select first homepage subcategory
  useEffect(() => {
    if (
      activeCategory === 'products' &&
      Array.isArray(subcategories) &&
      subcategories.length > 0 &&
      !subcategoryId
    ) {
      const homepageSubcat = subcategories.find((s) => s.isHomepage);
      if (homepageSubcat) {
        setSubcategoryId(homepageSubcat._id);
      }
    }
  }, [activeCategory, subcategories, subcategoryId]);

  // Get category configuration
  const categoryConfig = useMemo(() => {
    switch (activeCategory) {
      case 'featured':
        return {
          categoryId: undefined,
          isFeatured: true,
          subcategoryId: undefined,
        };
      case 'help':
        return {
          categoryId: HELP_CATEGORY_ID,
          isFeatured: false,
          subcategoryId: undefined,
        };
      default:
        return {
          categoryId: PRODUCTS_CATEGORY_ID,
          isFeatured: false,
          subcategoryId: subcategoryId,
        };
    }
  }, [activeCategory, subcategoryId]);

  // Fetch documents
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [
      'home-docs',
      activeCategory,
      page,
      searchQuery,
      categoryConfig.subcategoryId,
    ],
    queryFn: () =>
      getDocsByCategorySubcategory({
        page,
        limit: 5,
        isFeatured: categoryConfig.isFeatured,
        sort: 'desc',
        sortBy: 'updatedAt',
        search: searchQuery || undefined,
        status: 'published',
        categoryId: categoryConfig.categoryId,
        subcategoryId: categoryConfig.subcategoryId,
      }),
    refetchOnWindowFocus: false,
  });

  const docs: DocWithHome[] = data?.data || [];
  const meta = data?.meta;

  const homepageSubcats = useMemo(
    () => (subcategories || []).filter((s: ISubcategory) => s.isHomepage),
    [subcategories]
  );
  const isAtLimit = meta?.homepageTotal >= 3;
  const handleToggleHomepage = async (
    doc: DocWithHome,
    value: boolean
  ): Promise<void> => {
    try {
      if (value && isAtLimit) {
        toast.error(
          'The maximum limit has been reached. Please remove an existing document from the homepage section before adding a new one.',
          {
            duration: 20000, // 20 seconds
          }
        );
        return; // explicitly return void here
      }

      await updateDoc(doc._id, {
        isHomepage: value,
        homepageSection: value ? 'featured' : null,
      } as any);

      toast.success(`${value ? 'Added to' : 'Removed from'} homepage`);
      refetch();
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  //   const currentCategoryInfo = CATEGORY_CONFIG[activeCategory];

  return (
    <Card className='p-4 md:p-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-2 xs:flex-nowrap'>
          <div>
            <h1 className='text-base font-semibold text-gray-900 md:text-2xl'>
              Homepage Manager
            </h1>
            <p className='mt-1 text-xs text-gray-600 md:text-sm'>
              Control what content appears on your website&apos;s homepage
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              onClick={() => refetch()}
              variant='outline'
              disabled={isFetching}
              className='h-8'
            >
              <RefreshCw
                className={cn('size-4 sm:mr-2', isFetching && 'animate-spin')}
              />
              <span className='hidden sm:block'>Refresh</span>
            </Button>
            <Link
              href='/dashboard/admin/docs-management/create-docs'
              className='flex h-8 items-center rounded-md border px-2.5 shadow-sm duration-200 hover:bg-slate-200'
            >
              <FcPlus className='size-5 sm:mr-2' />
              <span className='hidden sm:block'> Docs</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative mb-6 max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Search documents...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='pl-10 pr-10'
          />
          {searchQuery && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleSearch('')}
              className='absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100'
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(value) => {
          setActiveCategory(value as any);
          setPage(1);
        }}
      >
        <TabsList className='mb-6 grid w-full grid-cols-3'>
          {Object.values(CATEGORY_CONFIG).map((config) => {
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={config.id}
                value={config.id}
                className='flex items-center gap-1 text-xs md:gap-2 md:text-sm'
              >
                <Icon className='hidden max-h-3 min-h-3 min-w-3 max-w-3 xs:block' />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.values(CATEGORY_CONFIG).map((config) => {
          const Icon = config.icon;
          return (
            <TabsContent
              key={config.id}
              value={config.id}
              className='space-y-6'
            >
              {/* Category Header */}
              <Card className={cn('border-l-4', config.color)}>
                <CardHeader className='p-3 pb-4 md:p-5'>
                  <div className='flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className={cn('rounded-lg p-2', config.color)}>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div>
                        <CardTitle className='text-base md:text-lg'>
                          {config.label}
                        </CardTitle>
                        <CardDescription className='text-xs md:text-sm'>
                          {config.description}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Category-specific actions */}
                    {config.id === 'products' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            className='p-1 text-xs xs:p-4 md:text-sm'
                          >
                            <Settings className='mr-2 h-4 w-4' />
                            Manage Homepage Subcategories
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>
                              Homepage Product Categories
                            </DialogTitle>
                            <DialogDescription>
                              Choose which product categories appear on your
                              homepage. Visitors will see these as main
                              navigation options.
                            </DialogDescription>
                          </DialogHeader>
                          {loadingSubcats ? (
                            <div className='py-8'>
                              <LoadingWithSpinner />
                            </div>
                          ) : subcategories ? (
                            <SubcategoryManager
                              subcategories={subcategories}
                              onUpdate={refetchSubcats}
                            />
                          ) : (
                            <Card className='p-6 text-center'>
                              <p className='text-muted-foreground'>
                                No categories found
                              </p>
                            </Card>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Active Homepage Categories (for Products) */}
              {config.id === 'products' && homepageSubcats.length > 0 && (
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium text-gray-700'>
                      Active Homepage Subcategories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {homepageSubcats.map((subcat) => (
                        <Badge
                          key={subcat._id}
                          variant='secondary'
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-blue-100',
                            subcategoryId === subcat._id &&
                              'border-blue-200 bg-blue-100 text-blue-700'
                          )}
                          onClick={() => setSubcategoryId(subcat._id)}
                        >
                          <Package className='mr-1 h-3 w-3' />
                          {subcat.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <QuickStats meta={meta} />

              {/* No Categories Message for Products */}
              {config.id === 'products' &&
                homepageSubcats.length === 0 &&
                !loadingSubcats && (
                  <Card className='border-2 border-dashed'>
                    <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                      <div className='mb-4 rounded-full bg-gray-100 p-3'>
                        <Settings className='h-8 w-8 text-gray-400' />
                      </div>
                      <h3 className='mb-2 font-semibold text-gray-900'>
                        No Homepage Categories
                      </h3>
                      <p className='mb-6 max-w-md text-gray-600'>
                        No product categories are currently displayed on your
                        homepage. Configure which categories should be featured
                        for visitors.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Settings className='mr-2 h-4 w-4' />
                            Set Up Categories
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>
                              Configure Homepage Categories
                            </DialogTitle>
                            <DialogDescription>
                              Choose which product categories to feature on your
                              homepage
                            </DialogDescription>
                          </DialogHeader>
                          {loadingSubcats ? (
                            <div className='py-8'>
                              <LoadingWithSpinner />
                            </div>
                          ) : subcategories ? (
                            <SubcategoryManager
                              subcategories={subcategories}
                              onUpdate={refetchSubcats}
                            />
                          ) : (
                            <Card className='p-6 text-center'>
                              <p className='text-muted-foreground'>
                                No categories available
                              </p>
                            </Card>
                          )}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                )}

              {/* Documents Section */}
              <Card>
                <CardHeader className='p-3 md:p-5'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-1.5'>
                      <CardTitle className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Documents
                      </CardTitle>
                      <CardDescription className='text-xs md:text-sm'>
                        {searchQuery
                          ? `Search results for "${searchQuery}"`
                          : `All ${config.label.toLowerCase()} documents`}
                      </CardDescription>
                    </div>
                    {docs.length > 0 && (
                      <Badge
                        variant='outline'
                        className='text-[10px] md:text-xs'
                      >
                        {docs.filter((d) => d.isHomepage).length} of{' '}
                        {docs.length} on homepage
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='px-3 md:px-5'>
                  {isLoading ? (
                    <div className='flex items-center justify-center py-12'>
                      <LoadingWithSpinner />
                    </div>
                  ) : docs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                      <div className='mb-4 rounded-full bg-gray-100 p-3'>
                        <FileText className='h-8 w-8 text-gray-400' />
                      </div>
                      <h3 className='mb-2 font-medium text-gray-900'>
                        No Documents Found
                      </h3>
                      <p className='mb-4 text-gray-600'>
                        {searchQuery
                          ? `No documents match "${searchQuery}"`
                          : `No documents in this category yet`}
                      </p>
                      {searchQuery ? (
                        <Button
                          variant='outline'
                          onClick={() => handleSearch('')}
                        >
                          <X className='mr-2 h-4 w-4' />
                          Clear Search
                        </Button>
                      ) : (
                        <Link href='/dashboard/admin/docs-management/create-docs'>
                          <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Create First Document
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {docs.map((doc) => (
                        <DocumentCard
                          key={doc._id}
                          doc={doc}
                          onToggleHomepage={handleToggleHomepage}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pagination */}
              {meta && (
                <div className='flex justify-center'>
                  <DocsPagination meta={meta} onPageChange={setPage} />
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </Card>
  );
}
