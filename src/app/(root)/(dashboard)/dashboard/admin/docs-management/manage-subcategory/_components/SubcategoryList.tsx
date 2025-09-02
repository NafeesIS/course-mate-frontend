'use client';
import { ISubcategory } from '@/app/(root)/docs/_types/types';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Edit, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { FcPlus } from 'react-icons/fc';
import { toast } from 'sonner';
import {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  updateSubcategory,
} from '../_services/services';
import CreateSubcategoryDialog from './CreateSubcategoryDialog';
import DeleteSubcategoryDialog from './DeleteSubcategoryDialog';
import { SubcategoryFormData } from './SubcategoryForm';
import SubcategoriesPagination from './SubcategoryPagination';
import UpdateSubcategoryDialog from './UpdateSubcategoryDialog';

type SortField = 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

const SubcategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sort, setSort] = useState<SortOrder>('desc');
  const [searchInput, setSearchInput] = useState(''); // Input value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query for API
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<ISubcategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use your actual API with useQuery
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['subcategories', page, limit, sort, sortBy, searchQuery],
    queryFn: () =>
      getAllSubcategories({
        page,
        limit,
        sort,
        sortBy,
        search: searchQuery || undefined,
      }),
    gcTime: 1000 * 60 * 10, // 10 minute
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on component mount
  });

  const subcategories = data?.subcategories || [];
  const sortedSubcategories = subcategories.sort((a, b) => {
    if (a.score === undefined) return 1; // put `a` later
    if (b.score === undefined) return -1; // put `b` later
    return b.score - a.score;
  });

  const meta = data?.meta;

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSort(sort === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc order
      setSortBy(field);
      setSort('desc');
    }
    setPage(1); // Reset to first page when sorting
  };

  // Limit change handler
  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1); // Reset to first page when limit changes
  };

  // Search input change handler
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Execute search
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1); // Reset to first page when searching
  };

  // Handle Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  // Handler functions
  const handleCreateSubcategory = async (formData: SubcategoryFormData) => {
    setIsCreating(true);

    try {
      await createSubcategory(formData);
      toast.success('Subcategory created successfully!');
      setCreateDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create subcategory. Please try again.';
      toast.error(message, { duration: 10000 });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubcategory = async (data: SubcategoryFormData) => {
    if (!selectedSubcategory) return;
    setIsUpdating(true);
    try {
      await updateSubcategory(selectedSubcategory._id, data.slug, data.name);
      toast.success('Subcategory updated successfully!');
      setUpdateDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update subcategory. Please try again.';
      toast.error(message, { duration: 10000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;
    setIsDeleting(true);
    try {
      await deleteSubcategory(selectedSubcategory._id);
      toast.success('Subcategory deleted successfully!');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete subcategory. Please try again.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (subcategory: ISubcategory) => {
    setSelectedSubcategory(subcategory);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (subcategory: ISubcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteDialogOpen(true);
  };

  if (isError) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-lg text-red-600'>
          Failed to fetch subcategories.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900 md:text-2xl'>
                Subcategories Management
              </h2>

              <div className='flex items-center gap-2'>
                <p className='mt-1 hidden text-sm text-gray-600 sm:block'>
                  Manage your {meta?.total || 'All'} subcategories
                </p>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-6 hover:bg-primary hover:text-white'
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={cn(
                      'h-3 w-3 text-xs',
                      isFetching && 'animate-spin'
                    )}
                  />
                </Button>
              </div>
            </div>
            <Button
              variant={'outline'}
              onClick={() => setCreateDialogOpen(true)}
              className='h-9 max-w-12 duration-200 hover:bg-slate-200 sm:max-w-max'
            >
              <FcPlus className='h-5 w-5 min-w-5 sm:mr-2' />
              <span className='hidden sm:block'> Subcategory</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filters */}
          <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex max-w-md flex-1 gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Search subcategories...'
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  className='pl-10'
                />
              </div>
              <Button
                onClick={handleSearch}
                variant='outline'
                className='h-9 bg-primary px-3 text-white duration-200 hover:bg-blue-900 hover:text-white'
              >
                <Search className='h-4 w-4' />
              </Button>
              {searchQuery && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClearSearch}
                  className='px-3'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Show:</span>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className='w-20'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                  <SelectItem value='100'>100</SelectItem>
                </SelectContent>
              </Select>
              <span className='text-sm text-gray-600'>per page</span>
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Meta Title</TableHead>
                  {/* <TableHead>Meta Description</TableHead> */}
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      onClick={() => handleSort('createdAt')}
                      className='h-auto p-0 font-medium hover:bg-transparent'
                    >
                      Created
                      {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
                      {sortBy === 'createdAt' && (
                        <span className='ml-1 text-xs'>
                          {sort === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant='ghost'
                      onClick={() => handleSort('updatedAt')}
                      className='h-auto p-0 font-medium hover:bg-transparent'
                    >
                      Updated
                      {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
                      {sortBy === 'updatedAt' && (
                        <span className='ml-1 text-xs'>
                          {sort === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      <LoadingWithSpinner />
                    </TableCell>
                  </TableRow>
                ) : sortedSubcategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      <div className='text-gray-500'>
                        {searchQuery
                          ? `No subcategories found matching "${searchQuery}"`
                          : 'No subcategories found. Create your first subcategory to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedSubcategories.map((subcategory) => (
                    <TableRow
                      key={subcategory._id}
                      className='hover:bg-gray-50'
                    >
                      <TableCell className='font-medium'>
                        {subcategory.name}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {subcategory.slug}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {subcategory.metaTitle}
                      </TableCell>
                      {/* <TableCell className='text-gray-500'>
                        {subcategory.metaDescription}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {subcategory.description}
                      </TableCell> */}
                      <TableCell className='text-gray-500'>
                        {subcategory.status}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-gray-500'>
                        {formatDate(subcategory.createdAt, 'dd-MMM-yyyy')}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-gray-500'>
                        {formatDate(subcategory.updatedAt, 'dd-MMM-yyyy')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditClick(subcategory)}
                            className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-900'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteClick(subcategory)}
                            className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-900'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className='mt-6'>
              <SubcategoriesPagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateSubcategoryDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubcategory}
        isLoading={isCreating}
      />

      <UpdateSubcategoryDialog
        isOpen={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        onSubmit={handleUpdateSubcategory}
        isLoading={isUpdating}
        subcategory={selectedSubcategory}
      />

      <DeleteSubcategoryDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteSubcategory}
        isLoading={isDeleting}
        subcategory={selectedSubcategory}
      />
    </div>
  );
};

export default SubcategoryList;
